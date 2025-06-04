import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ApprovalMonitoring() {
  return (
    <>
      <PageMeta
        title="Approval Monitoring"
        description="Approval Monitoring Page"
      />
      <PageBreadcrumb pageTitle="Approval Monitoring" />
      <div className="rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h1>Halohalo</h1>
      </div>
    </>
  );
}
