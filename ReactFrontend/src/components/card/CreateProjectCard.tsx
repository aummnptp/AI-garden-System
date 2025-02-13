import React from 'react'

interface CreateProjectCardProps {
    id:number;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
    isSelected: boolean; // เพิ่มตัวบ่งบอกว่าการ์ดถูกเลือกหรือไม่
    onSelect: () => void; // เพิ่มฟังก์ชันที่ใช้เมื่อการ์ดถูกคลิก
  }

const CreateProjectCard :React.FC<CreateProjectCardProps> = (props) => {
  return (
    <div
    className={`mx-auto my-5 w-11/12 h-fit bg-white shadow border rounded-[15px] p-4 cursor-pointer ${
      props.isSelected ? 'border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-400' : 'border-1 border-gray-300 shadow-md'
    }`}
    onClick={props.onSelect} // เรียกฟังก์ชันเมื่อการ์ดถูกคลิก
  >
          <img
            className=" w-full h-48  
            object-cover"
            src={props.img}
            />

          <h1 className=" py-2 text-black text-[25px] font-semibold">
            {props.name}
          </h1>
       
          <span className="  mb-2 w-fit bg-sky-500 rounded-[15px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">
          {props.type}
          </span>
          <p className=" px-4 py-2">
          {props.aiDesc}
          </p>
          {/* <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">ประเภท</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue={"รูปภาพและวิดีโอ"}
        >
          <FormControlLabel value="รูปภาพและวิดีโอ" control={<Radio />} label="รูปภาพ และ วิดีโอ " />
          <FormControlLabel value="รูปภาพ" control={<Radio />} label="รูปภาพ" />
          <FormControlLabel value="วิดีโอ" control={<Radio />} label="วิดีโอ" />
        </RadioGroup>
      </FormControl> */}
          <div className='  mb-4'>
           {props.tags.map((tag) => (
              <span  className="w-fit bg-sky-500 rounded-[10px] me-2 px-2.5 py-0.5    text-white text-xs font-normal">{tag}</span>
            ))}
            </div>
        </div>
  )
}


export default CreateProjectCard