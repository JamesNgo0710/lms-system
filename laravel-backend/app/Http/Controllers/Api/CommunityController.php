<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\CommunityComment;
use App\Models\CommunityVote;
use App\Models\CommunityBookmark;
use App\Models\CommunityReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommunityController extends Controller
{
    // Posts endpoints
    public function getPosts(Request $request)
    {
        $query = CommunityPost::visible()
            ->with(['author', 'votes'])
            ->withCount(['comments' => function($query) {
                $query->visible();
            }]);

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->has('author')) {
            $query->where('author_id', $request->author);
        }

        // Sort by pinned first, then by activity
        $posts = $query->orderBy('is_pinned', 'desc')
                      ->orderBy('last_activity_at', 'desc')
                      ->paginate(20);

        // Add user vote information if authenticated
        if (Auth::check()) {
            $posts->getCollection()->transform(function ($post) {
                $post->user_vote = $post->getUserVote(Auth::id());
                return $post;
            });
        }

        return response()->json($posts);
    }

    public function getPost($id)
    {
        $post = CommunityPost::visible()
            ->with(['author', 'votes'])
            ->findOrFail($id);

        // Add user vote information if authenticated
        if (Auth::check()) {
            $post->user_vote = $post->getUserVote(Auth::id());
        }

        return response()->json($post);
    }

    public function createPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $post = CommunityPost::create([
            'title' => $request->title,
            'content' => $request->content,
            'author_id' => Auth::id(),
            'last_activity_at' => now(),
        ]);

        $post->load('author');

        return response()->json($post, 201);
    }

    public function updatePost(Request $request, $id)
    {
        $post = CommunityPost::findOrFail($id);

        if (!$post->canUserEdit(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $post->update($request->only(['title', 'content']));
        $post->load('author');

        return response()->json($post);
    }

    public function deletePost($id)
    {
        $post = CommunityPost::findOrFail($id);

        if (!$post->canUserDelete(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    // Comments endpoints
    public function getComments($postId)
    {
        $post = CommunityPost::findOrFail($postId);

        $comments = $post->topLevelComments()
            ->visible()
            ->with(['author', 'replies.author', 'votes'])
            ->get();

        // Add user vote information if authenticated
        if (Auth::check()) {
            $this->addUserVotesToComments($comments);
        }

        return response()->json($comments);
    }

    private function addUserVotesToComments($comments)
    {
        foreach ($comments as $comment) {
            $comment->user_vote = $comment->getUserVote(Auth::id());
            if ($comment->replies->count() > 0) {
                $this->addUserVotesToComments($comment->replies);
            }
        }
    }

    public function createComment(Request $request, $postId)
    {
        $post = CommunityPost::findOrFail($postId);

        if ($post->is_locked) {
            return response()->json(['message' => 'This post is locked for comments'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
            'parent_id' => 'nullable|exists:community_comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = CommunityComment::create([
            'content' => $request->content,
            'author_id' => Auth::id(),
            'post_id' => $postId,
            'parent_id' => $request->parent_id,
        ]);

        $comment->load('author');

        return response()->json($comment, 201);
    }

    public function updateComment(Request $request, $id)
    {
        $comment = CommunityComment::findOrFail($id);

        if (!$comment->canUserEdit(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment->update(['content' => $request->content]);
        $comment->load('author');

        return response()->json($comment);
    }

    public function deleteComment($id)
    {
        $comment = CommunityComment::findOrFail($id);

        if (!$comment->canUserDelete(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    // Voting endpoints
    public function vote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'voteable_type' => 'required|in:post,comment',
            'voteable_id' => 'required|integer',
            'vote_type' => 'required|in:1,-1', // 1 for upvote, -1 for downvote
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voteableType = $request->voteable_type === 'post'
            ? CommunityPost::class
            : CommunityComment::class;

        $voteable = $voteableType::findOrFail($request->voteable_id);

        // Check if user already voted
        $existingVote = CommunityVote::where([
            'user_id' => Auth::id(),
            'voteable_type' => $voteableType,
            'voteable_id' => $request->voteable_id,
        ])->first();

        if ($existingVote) {
            if ($existingVote->vote_type == $request->vote_type) {
                // Same vote - remove it
                $existingVote->delete();
                return response()->json(['message' => 'Vote removed']);
            } else {
                // Different vote - update it
                $existingVote->update(['vote_type' => $request->vote_type]);
                return response()->json(['message' => 'Vote updated']);
            }
        } else {
            // New vote
            CommunityVote::create([
                'user_id' => Auth::id(),
                'voteable_type' => $voteableType,
                'voteable_id' => $request->voteable_id,
                'vote_type' => $request->vote_type,
            ]);
            return response()->json(['message' => 'Vote recorded']);
        }
    }

    // Admin endpoints
    public function togglePin($id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post = CommunityPost::findOrFail($id);
        $post->update(['is_pinned' => !$post->is_pinned]);

        return response()->json([
            'message' => $post->is_pinned ? 'Post pinned' : 'Post unpinned',
            'is_pinned' => $post->is_pinned
        ]);
    }

    public function toggleLock($id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post = CommunityPost::findOrFail($id);
        $post->update(['is_locked' => !$post->is_locked]);

        return response()->json([
            'message' => $post->is_locked ? 'Post locked' : 'Post unlocked',
            'is_locked' => $post->is_locked
        ]);
    }

    public function toggleHide($id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post = CommunityPost::findOrFail($id);
        $post->update(['is_hidden' => !$post->is_hidden]);

        return response()->json([
            'message' => $post->is_hidden ? 'Post hidden' : 'Post shown',
            'is_hidden' => $post->is_hidden
        ]);
    }

    public function hideComment($id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment = CommunityComment::findOrFail($id);
        $comment->update(['is_hidden' => !$comment->is_hidden]);

        return response()->json([
            'message' => $comment->is_hidden ? 'Comment hidden' : 'Comment shown',
            'is_hidden' => $comment->is_hidden
        ]);
    }

    // Bookmark endpoints
    public function toggleBookmark($id)
    {
        $post = CommunityPost::findOrFail($id);
        
        $bookmark = CommunityBookmark::where([
            'user_id' => Auth::id(),
            'post_id' => $id
        ])->first();

        if ($bookmark) {
            $bookmark->delete();
            $isBookmarked = false;
            $message = 'Bookmark removed';
        } else {
            CommunityBookmark::create([
                'user_id' => Auth::id(),
                'post_id' => $id
            ]);
            $isBookmarked = true;
            $message = 'Post bookmarked';
        }

        return response()->json([
            'message' => $message,
            'is_bookmarked' => $isBookmarked
        ]);
    }

    public function getUserBookmarks(Request $request)
    {
        $query = CommunityBookmark::where('user_id', Auth::id())
            ->with(['post' => function($query) {
                $query->visible()->with(['author', 'votes'])
                      ->withCount(['comments' => function($query) {
                          $query->visible();
                      }]);
            }]);

        $bookmarks = $query->orderBy('created_at', 'desc')
                          ->paginate($request->get('per_page', 20));

        // Filter out bookmarks where post was deleted/hidden
        $bookmarks->getCollection()->transform(function ($bookmark) {
            if ($bookmark->post) {
                $bookmark->post->user_vote = $bookmark->post->getUserVote(Auth::id());
                $bookmark->post->is_bookmarked = true;
            }
            return $bookmark;
        });

        return response()->json($bookmarks);
    }

    // Report endpoints
    public function reportContent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reportable_type' => 'required|in:post,comment',
            'reportable_id' => 'required|integer',
            'reason' => 'required|string|in:spam,harassment,inappropriate_content,misinformation,other',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reportableType = $request->reportable_type === 'post'
            ? CommunityPost::class
            : CommunityComment::class;

        $reportable = $reportableType::findOrFail($request->reportable_id);

        // Check if user already reported this content
        $existingReport = CommunityReport::where([
            'reporter_id' => Auth::id(),
            'reportable_type' => $reportableType,
            'reportable_id' => $request->reportable_id,
        ])->first();

        if ($existingReport) {
            return response()->json(['message' => 'You have already reported this content'], 409);
        }

        CommunityReport::create([
            'reporter_id' => Auth::id(),
            'reportable_type' => $reportableType,
            'reportable_id' => $request->reportable_id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Content reported successfully']);
    }

    public function getReports(Request $request)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = CommunityReport::with(['reporter', 'reviewer', 'reportable' => function($morphTo) {
            $morphTo->morphWith([
                CommunityPost::class => ['author'],
                CommunityComment::class => ['author'],
            ]);
        }]);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('reason')) {
            $query->where('reason', $request->reason);
        }

        $reports = $query->orderBy('created_at', 'desc')
                        ->paginate($request->get('per_page', 20));

        return response()->json($reports);
    }

    public function updateReportStatus(Request $request, $id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewed,resolved,dismissed',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $report = CommunityReport::findOrFail($id);
        
        $report->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Report status updated successfully',
            'report' => $report->load(['reporter', 'reviewer'])
        ]);
    }
}
