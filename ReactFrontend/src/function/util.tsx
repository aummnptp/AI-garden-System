

export default function stringToColor(string:string) {
  let hash = 0;
  for (let i = 0 ; i < string.length; i++){
    hash = string.charCodeAt(i) +((hash <<5)-hash);
  }
  let color ="#";
  for (let i = 0 ; i<3 ; i++){
    const value = (hash >>(i*8))& 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

    return color;
  
}


export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date"; // หรือข้อความอื่น เช่น "N/A"
  }
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid time"; // หรือข้อความอื่น เช่น "N/A"
  }
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
