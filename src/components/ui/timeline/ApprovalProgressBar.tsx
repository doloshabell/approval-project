import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { Approval } from "../../../types/approval"; // sesuaikan dengan path-nya

interface ApprovalProgressBarProps {
  approvals: Approval[];
}

const ApprovalProgressBar: React.FC<ApprovalProgressBarProps> = ({ approvals }) => {
  const currentStatusIndex = approvals.findIndex(a => a.isApprove === null);
  const activeIndex = currentStatusIndex === -1 ? approvals.length : currentStatusIndex;

  return (
    <div className="my-10 py-5 px-11 h-fit">
      <ProgressBar
        percent={(activeIndex / (approvals.length - 1)) * 100}
        filledBackground="linear-gradient(to right, #16a34a, #16a34a)"
      >
        {approvals.map((approval, index) => (
          <Step key={approval.id}>
            {(step: { accomplished: boolean }) => {
              const { accomplished } = step;
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: "80px",
                    padding: "0 4px",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: accomplished ? "#16a34a" : "#e5e7eb",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: accomplished ? "white" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      textAlign: "center",
                      color: accomplished ? "#16a34a" : "#6b7280",
                    }}
                  >
                    {approval.roleName}
                  </div>
                  {approval.approvalDate && (
                    <div
                      style={{
                        fontSize: 10,
                        marginTop: 2,
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(approval.approvalDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            }}
          </Step>
        ))}
      </ProgressBar>
    </div>
  );
};

export default ApprovalProgressBar;
