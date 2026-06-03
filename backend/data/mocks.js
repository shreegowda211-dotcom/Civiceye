// Minimal mock data reused by the backend to simulate a real API
exports.users = [
  { _id: "u_1", name: "Rakshitha D", email: "rakshithadml74@gmail.com", role: "citizen", phone: "+91 90000 11111", avatar: null },
  { _id: "u_2", name: "Rakshitha SR", email: "rakshithasr990@gmail.com", role: "officer", phone: "+91 90000 22222", avatar: null, department: { _id: "d_1", name: "Public Works" } },
  { _id: "u_3", name: "Shree Gowda", email: "shreegowda211@gmail.com", role: "admin", phone: "+91 90000 33333", avatar: null },
  { _id: "u_4", name: "Vikram Kumar", email: "rakshithasr991@gmail.com", role: "officer", phone: "+91 90000 44444", avatar: null, department: { _id: "d_2", name: "Water Board" } },
  { _id: "u_5", name: "Priya Sharma", email: "rakshithasr992@gmail.com", role: "officer", phone: "+91 90000 55555", avatar: null, department: { _id: "d_3", name: "Electricity Board" } },
  { _id: "u_6", name: "Raj Patel", email: "rakshithasr993@gmail.com", role: "officer", phone: "+91 90000 66666", avatar: null, department: { _id: "d_4", name: "Sanitation" } },
  { _id: "u_7", name: "Anjali Desai", email: "rakshithasr994@gmail.com", role: "officer", phone: "+91 90000 77777", avatar: null, department: { _id: "d_5", name: "Health" } },
  { _id: "u_8", name: "Suresh Singh", email: "rakshithasr995@gmail.com", role: "officer", phone: "+91 90000 88888", avatar: null, department: { _id: "d_6", name: "Drainage" } },
  { _id: "u_9", name: "Meera Gupta", email: "rakshithasr996@gmail.com", role: "officer", phone: "+91 90000 99999", avatar: null, department: { _id: "d_7", name: "Environment" } },
  { _id: "u_10", name: "Arjun Verma", email: "rakshithasr997@gmail.com", role: "officer", phone: "+91 90000 00000", avatar: null, department: { _id: "d_8", name: "Public Safety" } }
];

exports.departments = [
  {
    _id: "d_1",
    name: "Public Works",
    description: "Roads, footpaths, public infrastructure",
    categories: ["roads"],
    officerCount: 6,
    openCount: 14,
    resolvedCount: 51,
  },
  {
    _id: "d_2",
    name: "Water Board",
    description: "Water supply, leaks, pipelines",
    categories: ["water_supply"],
    officerCount: 4,
    openCount: 9,
    resolvedCount: 32,
  },
  {
    _id: "d_3",
    name: "Electricity Board",
    description: "Streetlights, transformers, outages",
    categories: ["electricity"],
    officerCount: 5,
    openCount: 7,
    resolvedCount: 40,
  },
  {
    _id: "d_4",
    name: "Sanitation",
    description: "Garbage collection, public toilets",
    categories: ["sanitation"],
    officerCount: 8,
    openCount: 18,
    resolvedCount: 72,
  },
  {
    _id: "d_5",
    name: "Health",
    description: "Public health, vector control",
    categories: ["health"],
    officerCount: 3,
    openCount: 4,
    resolvedCount: 19,
  },
  {
    _id: "d_6",
    name: "Drainage",
    description: "Storm drains, sewage, water logging",
    categories: ["drainage"],
    officerCount: 4,
    openCount: 11,
    resolvedCount: 27,
  },
  {
    _id: "d_7",
    name: "Environment",
    description: "Trees, pollution, parks",
    categories: ["environment"],
    officerCount: 3,
    openCount: 5,
    resolvedCount: 16,
  },
  {
    _id: "d_8",
    name: "Public Safety",
    description: "Civic safety, signage, hazards",
    categories: ["public_safety"],
    officerCount: 4,
    openCount: 6,
    resolvedCount: 22,
  },
];

exports.complaints = [
  {
    _id: "c_1",
    title: "Pothole on Main Street",
    description: "Large pothole outside the post office has been getting worse for weeks.",
    category: "roads",
    status: "in_progress",
    images: [],
    resolutionImages: [],
    location: { state: "Karnataka", city: "Bangalore", area: "Jayanagar", latitude: 12.9320, longitude: 77.5848, gps: true },
    citizen: { _id: "u_1", name: "Rakshitha Dharmasthala", email: "rakshithadml74@gmail.com" },
    department: { _id: "d_1", name: "Public Works" },
    assignedOfficer: { _id: "u_2", name: "Rakshitha SR" },
    timeline: [
      { status: "pending", message: "Complaint filed by citizen." },
      { status: "assigned", message: "Assigned to officer Rakshitha SR." }
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "c_2",
    title: "Streetlight out for 3 days",
    description: "The entire block is dark after sunset. It is unsafe for pedestrians.",
    category: "electricity",
    status: "assigned",
    images: [],
    resolutionImages: [],
    location: { state: "Karnataka", city: "Bangalore", area: "Koramangala", latitude: 12.9352, longitude: 77.6245, gps: true },
    citizen: { _id: "u_1", name: "Rakshitha Dharmasthala", email: "rakshithadml74@gmail.com" },
    department: { _id: "d_3", name: "Electricity Board" },
    assignedOfficer: { _id: "u_2", name: "Rakshitha SR" },
    timeline: [
      { status: "pending", message: "Complaint filed by citizen." },
      { status: "assigned", message: "Assigned to officer Rakshitha SR." }
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "c_3",
    title: "Garbage collection missed for 2 days",
    description: "Waste has piled up outside the building entrance and smells bad.",
    category: "sanitation",
    status: "pending",
    images: [],
    resolutionImages: [],
    location: { state: "Maharashtra", city: "Mumbai", area: "Andheri West", latitude: 19.1364, longitude: 72.8296, gps: false },
    citizen: { _id: "u_1", name: "Rakshitha Dharmasthala", email: "rakshithadml74@gmail.com" },
    department: null,
    assignedOfficer: null,
    timeline: [
      { status: "pending", message: "Complaint filed by citizen." }
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "c_4",
    title: "Water leak near park entrance",
    description: "A steady leak has created a muddy patch and is wasting water.",
    category: "water_supply",
    status: "resolved",
    images: [],
    resolutionImages: [],
    location: { state: "Karnataka", city: "Bangalore", area: "HSR Layout", latitude: 12.9120, longitude: 77.6446, gps: true },
    citizen: { _id: "u_1", name: "Rakshitha Dharmasthala", email: "rakshithadml74@gmail.com" },
    department: { _id: "d_2", name: "Water Board" },
    assignedOfficer: { _id: "u_2", name: "Rakshitha SR" },
    timeline: [
      { status: "pending", message: "Complaint filed by citizen." },
      { status: "assigned", message: "Assigned to officer Rakshitha SR." },
      { status: "resolved", message: "Issue resolved by officer Rakshitha SR." }
    ],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: "c_5",
    title: "Open drain on footpath",
    description: "The drain cover is missing and it is dangerous for everyone walking there.",
    category: "drainage",
    status: "in_progress",
    images: [],
    resolutionImages: [],
    location: { state: "Tamil Nadu", city: "Chennai", area: "T. Nagar", latitude: 13.0418, longitude: 80.2341, gps: true },
    citizen: { _id: "u_1", name: "Rakshitha Dharmasthala", email: "rakshithadml74@gmail.com" },
    department: { _id: "d_4", name: "Drainage" },
    assignedOfficer: { _id: "u_2", name: "Rakshitha SR" },
    timeline: [
      { status: "pending", message: "Complaint filed by citizen." },
      { status: "assigned", message: "Assigned to officer Rakshitha SR." }
    ],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

exports.notifications = [
  { _id: "n_1", userId: "u_1", title: "Complaint update",     message: "Your pothole complaint is now in progress.",      link: "/citizen/complaints/c_1", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "n_2", userId: "u_1", title: "Officer assigned",    message: "Your streetlight complaint has been assigned to Rakshitha SR.", link: "/citizen/complaints/c_2", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "n_3", userId: "u_2", title: "New complaint assigned",message: "A new complaint has been assigned to you.",           link: "/officer/complaints/c_1", read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { _id: "n_4", userId: "u_3", title: "Daily summary",        message: "5 complaints in the system; 1 resolved, 4 open.",  link: "/admin/dashboard",          read: true,  createdAt: new Date(Date.now() - 86400000).toISOString() }
];
