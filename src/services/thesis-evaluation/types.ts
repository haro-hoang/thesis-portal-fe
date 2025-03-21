export interface ThesisEvaluation {
  id: string;
  thesisId: string;
  plagiarismCheck: {
    isPassed: boolean;
    percentage: number;
    comment: string;
  };
  overallEvaluation: string; // Đánh giá chung
  isApprovedForDefense: boolean; // Đồng ý cho bảo vệ
  rejectionReason?: string; // Lý do từ chối
  createdAt: Date;
  updatedAt: Date;
}
