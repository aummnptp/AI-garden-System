import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Avatar, Typography, Toolbar, TextField, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent
} from "@mui/material";
import { CameraOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { formatDate, getImageUrl } from '../../function/util';
import { formatTime } from '../../function/util';
import ProjectImage from '../../components/card/ProjectLetterImage';

interface Data {
  historyId: string;
  project: { imagePath: string; name: string; input_type: string };
  ai_model: { ai_type: string };
  createdAt: string;
  user: { name: string; picture: string };
  inputNumber: number;
}

const Workspacetable: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [historyData, setHistoryData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("createdAt");
  const [searchItem, setSearchItem] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/all-history-in-project`,{
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();

        const formattedData: Data[] = data.map((item: any) => ({
          historyId: item.historyId,
          project: {
            imagePath: item.project?.imagePath || "",
            name: item.project?.name || "Unknown",
            input_type: item.project?.input_type || "รูปภาพ",
          },
          ai_model: { ai_type: item.ai_model?.ai_type || "Unknown" },
          createdAt: item.createdAt ? new Date(item.createdAt.replace(" ", "T")) : null,
          user: { name: item.user?.name || "Unknown", picture: item.user?.picture || "" },
          inputNumber: 1,
        }));


        setHistoryData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    filterData();
  }, [searchItem, filterType, historyData]);

  const filterData = () => {
    let filtered = historyData;

    if (filterType !== "All") {
      filtered = filtered.filter(item => item.ai_model.ai_type === filterType);
    }

    if (searchItem.trim()) {
      filtered = filtered.filter(item =>
        item.project.name.toLowerCase().includes(searchItem.toLowerCase()) || 
        item.user.name.toLowerCase().includes(searchItem.toLowerCase()) 
      );
    }

    setFilteredData(filtered);
  };


  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sorted = [...historyData].sort((a, b) => {
      let valueA: any = a[property];
      let valueB: any = b[property];

      if (property === "createdAt") {
        return isAsc
          ? (new Date(valueA) as any) - (new Date(valueB) as any)
          : (new Date(valueB) as any) - (new Date(valueA) as any);
      }

      if (property === "inputNumber") {
        return isAsc ? valueA - valueB : valueB - valueA;
      }

      if (property === "project") {
        valueA = a.project.name;
        valueB = b.project.name;
      }

      if (property === "user") {
        valueA = a.user.name;
        valueB = b.user.name;
      }

      return isAsc ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
    });

    setFilteredData(sorted);
  };


  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>

        {/* Toolbar สำหรับค้นหาและฟิลเตอร์ */}
        <Toolbar>
          <div className="grid grid-cols-3 w-full">
            <div className="col-span-2">
              <TextField
                sx={{ width: "80%" }}
                id="outlined-basic"
                label="ค้นหาด้วยชื่อโปรเจค หรือชื่อผู้อัปโหลด" 
                variant="outlined"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
            <FormControl fullWidth variant="outlined" sx={{ position: "relative" }}>
              <InputLabel
                id="filter-label"
                sx={{ position: "absolute", top: -8, background: "white", px: 0.5 }}
              >
                Filter by Type
              </InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filterType}
                onChange={(e: SelectChangeEvent<string>) => setFilterType(e.target.value)}
              >
                <MenuItem value="All">ทั้งหมด</MenuItem>
                <MenuItem value="Object Detection">Object Detection</MenuItem>
                <MenuItem value="Segmentation">Segmentation</MenuItem>
                <MenuItem value="Regression">Regression</MenuItem>
                <MenuItem value="Classification">Classification</MenuItem>
              </Select>
            </FormControl>




          </div>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>รูป</TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === "project"} direction={order} onClick={() => handleRequestSort("project")}>
                    ชื่อ Project
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === "createdAt"} direction={order} onClick={() => handleRequestSort("createdAt")}>
                    วันที่
                  </TableSortLabel>
                </TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === "user"} direction={order} onClick={() => handleRequestSort("user")}>
                    ผู้อัปโหลด
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row) => {
                // const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;
                // const imagePath = row.project.imagePath.startsWith("http")
                //   ? row.project.imagePath
                //   : `${BASE_URL}${row.project.imagePath}`;

                return (
                  <TableRow key={row.historyId}>
                    <TableCell>
                      {row.project.imagePath && row.project.imagePath.trim() !== "" ? (
                        <Avatar
                          variant="square"
                          src={getImageUrl(row.project.imagePath)}
                          sx={{ width: 100, height: 100, borderRadius: "10px" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/default-image.png"; 
                          }}
                        />
                      ) : (
                        <ProjectImage
                          projectName={row.project.name}
                          className="w-[100px] h-[100px] rounded-[10px] text-white font-bold text-2xl"
                        />
                      )}
                    </TableCell>


                    <TableCell>
                      <Typography variant="h6" sx={{ color: "indigo", fontWeight: "bold" }}>
                        {row.project.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {row.ai_model.ai_type}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {formatDate(row.createdAt)}
                      </Typography>
                      <Typography variant="body2">
                        {formatTime(row.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {row.project.input_type === "วิดีโอ" ? (
                        <PlaySquareOutlined style={{ fontSize: "1.5rem" }} />
                      ) : (
                        <CameraOutlined style={{ fontSize: "1.5rem" }} />
                      )}
                      <Typography component="span" sx={{ fontWeight: "bold", ml: 1 }}>
                        {row.inputNumber}
                      </Typography>{" "}
                      {row.project.input_type}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={row.user.picture} sx={{ width: 40, height: 40, mr: 1 }} />
                        <Typography>{row.user.name}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Workspacetable;
