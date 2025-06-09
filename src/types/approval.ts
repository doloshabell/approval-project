export interface Approval {
  id: number;
  sequence: number;
  isApprove: boolean | null;
  approvalDate: string | null;
  roleId: number;
  roleName: string;
  estateId: number;
  estateName: string;
}
