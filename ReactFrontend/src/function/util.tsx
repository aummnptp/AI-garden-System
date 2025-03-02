

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
    return "Invalid date"; 
  }

  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
};

export const formatTime = (dateString: string | Date): string => {
  if (!dateString) return "Invalid time"; 

  let date = new Date(dateString);

  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok", 
  }).format(date) + " น.";
};



export const getImageUrl = (path?: string): string => {
  if (!path) return "/default-image.jpg"; 
  return `${import.meta.env.VITE_NEST_BACKEND_API_URL}${path}`;
};


