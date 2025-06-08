import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "./UserProfile/UserMetaCard";
import UserInfoCard from "./UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Profile"
        description="Profile Dashboard Page"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
