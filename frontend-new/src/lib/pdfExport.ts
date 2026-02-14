import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { OverviewMetrics } from './analyticsApi';

export const exportAnalyticsToPDF = (metrics: OverviewMetrics, filter: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(107, 95, 176); // Primary color
  doc.text('ChatterHub Analytics Report', 14, 20);
  
  // Add date and filter info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 28);
  doc.text(`Period: ${filter === 'today' ? 'Today' : filter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}`, 14, 34);
  
  // Overview Metrics Table
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Overview Metrics', 14, 45);
  
  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value', 'Change (%)']],
    body: [
      ['Total Users', metrics.totalUsers.toLocaleString(), '-'],
      ['New Signups', metrics.newSignups.toLocaleString(), metrics.signupChange ? `${metrics.signupChange > 0 ? '+' : ''}${metrics.signupChange}%` : '-'],
      ['Page Views', metrics.pageViews.toLocaleString(), metrics.pageViewChange ? `${metrics.pageViewChange > 0 ? '+' : ''}${metrics.pageViewChange}%` : '-'],
      ['Unique Visitors', metrics.uniqueVisitors.toLocaleString(), '-'],
      ['Active Users', metrics.activeUsers.toLocaleString(), metrics.activeUserChange ? `${metrics.activeUserChange > 0 ? '+' : ''}${metrics.activeUserChange}%` : '-'],
      ['Avg Session Duration', `${metrics.avgSessionDuration}s`, metrics.sessionDurationChange ? `${metrics.sessionDurationChange > 0 ? '+' : ''}${metrics.sessionDurationChange}%` : '-'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [107, 95, 176] },
  });
  
  // Activity Breakdown Table
  const finalY = (doc as any).lastAutoTable.finalY || 50;
  doc.setFontSize(14);
  doc.text('Activity Breakdown', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Activity Type', 'Count']],
    body: [
      ['Posts', metrics.activityBreakdown.posts.toLocaleString()],
      ['Likes', metrics.activityBreakdown.likes.toLocaleString()],
      ['Comments', metrics.activityBreakdown.comments.toLocaleString()],
      ['Follows', metrics.activityBreakdown.follows.toLocaleString()],
      ['Unfollows', metrics.activityBreakdown.unfollows.toLocaleString()],
      ['Total Activities', metrics.activityBreakdown.total.toLocaleString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [107, 95, 176] },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'ChatterHub - Admin Analytics',
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Save the PDF
  doc.save(`analytics-${filter}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportUsersToPDF = (users: any[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(107, 95, 176);
  doc.text('ChatterHub Users Report', 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 28);
  doc.text(`Total Users: ${users.length}`, 14, 34);
  
  // Users Table
  autoTable(doc, {
    startY: 40,
    head: [['Name', 'Email', 'Role', 'Status', 'Joined']],
    body: users.map(user => [
      user.name,
      user.email,
      user.role,
      user.status,
      format(new Date(user.createdAt), 'PP'),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [107, 95, 176] },
    styles: { fontSize: 8 },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`users-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
