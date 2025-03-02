
function calculateDaysPassed(dateString: string | Date): string {
    const givenDate = typeof dateString === 'string' ? new Date(dateString) : dateString; // แปลง string เป็น Date
    const currentDate = new Date(); // วันที่ปัจจุบัน
    
   
    const timeDifference = currentDate.getTime() - givenDate.getTime();
    
    
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysPassed === 0) {
        return "ภายในวันนี้";
    } else if (daysPassed >= 365) {
    const yearsPassed = Math.floor(daysPassed / 365);
    return `เมื่อ ${yearsPassed} ปีที่แล้ว`;
} else if (daysPassed >= 30) {
    const monthsPassed = Math.floor(daysPassed / 30);
    return `เมื่อ ${monthsPassed} เดือนที่แล้ว`;
} else {
    return `เมื่อ ${daysPassed} วันที่แล้ว`;
}
}


export default calculateDaysPassed