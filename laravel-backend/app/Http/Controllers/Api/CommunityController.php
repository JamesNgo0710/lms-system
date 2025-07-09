<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\CommunityReply;
use App\Models\User;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    // Posts
    public function getPosts()
    {
        $posts = CommunityPost::with(['author', 'replies.author'])
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                // Add author name for compatibility
                $post->author_name = $post->author->name;

                // Add like status for current user
                if (auth()->check()) {
                    $post->is_liked_by_user = $post->isLikedBy(auth()->id());
                }

                return $post;
            });

        return response()->json($posts);
    }

    public function getPost($id)
    {
        $post = CommunityPost::with(['author', 'replies.author', 'replies.childReplies.author'])
            ->findOrFail($id);

        // Increment views
        $post->increment('views');

        // Add author name for compatibility
        $post->author_name = $post->author->name;

        // Add like status for current user
        if (auth()->check()) {
            $post->is_liked_by_user = $post->isLikedBy(auth()->id());

            // Add like status for replies
            $post->replies = $post->replies->map(function ($reply) {
                $reply->author_name = $reply->author->name;
                $reply->is_liked_by_user = $reply->isLikedBy(auth()->id());

                // Handle nested replies
                if ($reply->childReplies) {
                    $reply->childReplies = $reply->childReplies->map(function ($childReply) {
                        $childReply->author_name = $childReply->author->name;
                        $childReply->is_liked_by_user = $childReply->isLikedBy(auth()->id());
                        return $childReply;
                    });
                }

                return $reply;
            });
        }

        return response()->json($post);
    }

    public function createPost(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $post = CommunityPost::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'author_id' => auth()->id(),
            'category' => $validated['category'],
            'tags' => $validated['tags'] ?? [],
            'status' => 'active',
        ]);

        return response()->json($post->load('author'), 201);
    }

    public function updatePost(Request $request, $id)
    {
        $post = CommunityPost::findOrFail($id);

        // Check if user can edit (author or admin)
        if ($post->author_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category' => 'sometimes|string|max:255',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
            'is_pinned' => 'sometimes|boolean',
            'status' => 'sometimes|in:active,closed,archived',
        ]);

        // Only admins can pin posts or change status
        if (!auth()->user()->hasRole('admin')) {
            unset($validated['is_pinned'], $validated['status']);
        }

        $post->update($validated);

        return response()->json($post->load('author'));
    }

    public function deletePost($id)
    {
        $post = CommunityPost::findOrFail($id);

        // Check if user can delete (author or admin)
        if ($post->author_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function togglePostLike($id)
    {
        $post = CommunityPost::findOrFail($id);
        $liked = $post->toggleLike(auth()->id());

        return response()->json([
            'liked' => $liked,
            'total_likes' => $post->fresh()->likes
        ]);
    }

    // Replies
    public function getRepliesByPost($postId)
    {
        $replies = CommunityReply::with(['author', 'childReplies.author'])
            ->where('post_id', $postId)
            ->whereNull('parent_reply_id') // Only top-level replies
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($reply) {
                $reply->author_name = $reply->author->name;

                if (auth()->check()) {
                    $reply->is_liked_by_user = $reply->isLikedBy(auth()->id());

                    // Handle nested replies
                    if ($reply->childReplies) {
                        $reply->childReplies = $reply->childReplies->map(function ($childReply) {
                            $childReply->author_name = $childReply->author->name;
                            $childReply->is_liked_by_user = $childReply->isLikedBy(auth()->id());
                            return $childReply;
                        });
                    }
                }

                return $reply;
            });

        return response()->json($replies);
    }

    public function createReply(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:community_posts,id',
            'content' => 'required|string',
            'parent_reply_id' => 'nullable|exists:community_replies,id',
        ]);

        $reply = CommunityReply::create([
            'post_id' => $validated['post_id'],
            'author_id' => auth()->id(),
            'content' => $validated['content'],
            'parent_reply_id' => $validated['parent_reply_id'] ?? null,
        ]);

        // Update post reply count
        $post = CommunityPost::find($validated['post_id']);
        $post->updateReplyCount();

        return response()->json($reply->load('author'), 201);
    }

    public function updateReply(Request $request, $id)
    {
        $reply = CommunityReply::findOrFail($id);

        // Check if user can edit (author or admin)
        if ($reply->author_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $reply->update($validated);

        return response()->json($reply->load('author'));
    }

    public function deleteReply($id)
    {
        $reply = CommunityReply::findOrFail($id);

        // Check if user can delete (author or admin)
        if ($reply->author_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $postId = $reply->post_id;
        $reply->delete();

        // Update post reply count
        $post = CommunityPost::find($postId);
        $post->updateReplyCount();

        return response()->json(['message' => 'Reply deleted successfully']);
    }

    public function toggleReplyLike($id)
    {
        $reply = CommunityReply::findOrFail($id);
        $liked = $reply->toggleLike(auth()->id());

        return response()->json([
            'liked' => $liked,
            'total_likes' => $reply->fresh()->likes
        ]);
    }

    public function markReplyAsAccepted($id)
    {
        $reply = CommunityReply::findOrFail($id);

        // Only post author or admin can mark as accepted
        if ($reply->post->author_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reply->markAsAccepted();

        return response()->json(['message' => 'Reply marked as accepted answer']);
    }

    // Community Stats
    public function getStats()
    {
        $totalPosts = CommunityPost::count();
        $totalReplies = CommunityReply::count();
        $totalUsers = User::count();
        $answeredPosts = CommunityPost::where('is_answered', true)->count();
        $answeredRate = $totalPosts > 0 ? round(($answeredPosts / $totalPosts) * 100, 2) : 0;

        // Top categories
        $topCategories = CommunityPost::selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category,
                    'count' => $item->count
                ];
            });

        // Top contributors
        $topContributors = User::withCount(['communityPosts', 'communityReplies'])
            ->having('community_posts_count', '>', 0)
            ->orHaving('community_replies_count', '>', 0)
            ->orderByRaw('community_posts_count + community_replies_count DESC')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'posts' => $user->community_posts_count,
                    'replies' => $user->community_replies_count,
                    'reputation' => ($user->community_posts_count * 5) + ($user->community_replies_count * 2),
                ];
            });

        return response()->json([
            'total_posts' => $totalPosts,
            'total_replies' => $totalReplies,
            'total_users' => $totalUsers,
            'answered_rate' => $answeredRate,
            'top_categories' => $topCategories,
            'top_contributors' => $topContributors,
        ]);
    }
}
