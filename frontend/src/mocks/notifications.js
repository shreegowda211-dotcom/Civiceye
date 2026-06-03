export const mockNotifications = [
  { _id: "n_1", userId: "u_1", type: "status",     title: "Complaint update",     message: "Your pothole report is now In Progress",        link: "/citizen/complaints/c_1001", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "n_2", userId: "u_1", type: "assignment", title: "Officer assigned",     message: "Rakshitha SR (Public Works) is on your complaint", link: "/citizen/complaints/c_1001", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "n_3", userId: "u_1", type: "resolution", title: "Issue resolved",       message: "Water leakage near park has been resolved",      link: "/citizen/complaints/c_1004", read: true,  createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { _id: "n_4", userId: "u_2", type: "assignment", title: "New complaint assigned",message: "Pothole on 100ft Road assigned to you",         link: "/officer/complaints/c_1001", read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { _id: "n_5", userId: "u_3", type: "system",     title: "Daily summary",        message: "12 new complaints today, 8 resolved",            link: "/admin/dashboard",          read: true,  createdAt: new Date(Date.now() - 86400000).toISOString() },
];
