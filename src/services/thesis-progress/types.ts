export interface ThesisProgressLog {
  id: string;
  thesisId: string;
  weekNumber: number; // Tuần thứ mấy
  workDone: string; // Công việc đã thực hiện
  checkDate: Date; // Ngày kiểm tra
  results: string; // Kết quả đạt được
  teacherComment: string; // Nhận xét của giáo viên
  createdAt: Date;
  updatedAt: Date;
}
