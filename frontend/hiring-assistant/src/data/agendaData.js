// top_px = (startHour-9)*84 + (startMin/60)*84 | height_px = (durationMins/60)*84
export const agendaEvents = [
  { id:1, title:'Faculty Interview',         subtitle:'Dr. Ananya Roy',              timeLabel:'09:15–10:15', top:21,  height:84, variant:'primary' },
  { id:2, title:'Team Standup',              subtitle:'Sync on active pipeline',       timeLabel:'10:30–11:30', top:126, height:84, variant:'default' },
  { id:3, title:'Offer Discussion: Dr.Mehta',subtitle:'Compensation — Physics Dept',  timeLabel:'11:45–12:15', top:231, height:42, variant:'default' },
  { id:4, title:'Candidate Screening',       subtitle:'Reviewing resumes',             timeLabel:'13:00–14:00', top:336, height:84, variant:'default' },
  { id:5, title:'Hiring Pipeline Sync',      subtitle:'All Dept Heads & HR',           timeLabel:'14:15–15:15', top:441, height:84, variant:'default' },
  { id:6, title:'Background Verification',   subtitle:'Vendor sync — TrustCheck India',timeLabel:'15:30–16:00', top:546, height:42, variant:'dashed'  },
  { id:7, title:'Focus Time',                subtitle:null,                             timeLabel:'16:00–16:45', top:588, height:63, variant:'dashed'  },
  { id:8, title:'Wrap-Up & Notes',           subtitle:'Summarize outcomes',             timeLabel:'17:15–17:45', top:693, height:42, variant:'default' },
]
export const timeGridLines = [
  {label:'09:00',top:0},{label:'10:00',top:84},{label:'11:00',top:168},
  {label:'12:00',top:252},{label:'13:00',top:336},{label:'14:00',top:420},
  {label:'15:00',top:504},{label:'16:00',top:588},{label:'17:00',top:672},
  {label:'18:00',top:756},{label:'19:00',top:840},
]
