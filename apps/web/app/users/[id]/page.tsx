import { UserProfileView } from "../../../components/user-profile-view";
import { apiFetch } from "../../../lib/api";

type PublicProfile = {
  id: string;
  nickname: string;
  bio?: string | null;
  avatarUrl?: string | null;
  title?: string | null;
  company?: string | null;
  yearsOfExp?: string | null;
  interests?: string[];
  posts: Array<{
    id: string;
    title: string;
    excerpt?: string | null;
    type: string;
    likeCount: number;
    favoriteCount: number;
    category: { name: string };
  }>;
  followers: Array<{ followerId: string }>;
  following: Array<{ followingId: string }>;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
};

async function getProfile(id: string) {
  return apiFetch<PublicProfile>(`/users/${id}`).catch(() => null);
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    return <div className="empty card">用户不存在或暂时无法访问。</div>;
  }

  return <UserProfileView profile={profile} />;
}
