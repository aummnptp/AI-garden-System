import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Avatar,
  Typography,
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CameraOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { formatDate, getImageUrl } from "../../function/util";
import { formatTime } from "../../function/util";
import ProjectImage from "../../components/card/ProjectLetterImage";
import { useHistoryData } from "../../hook/history/useHistoryData";

export interface Data {
  historyId: string;
  project: { imagePath: string; name: string; input_type: string };
  ai_model: { ai_type: string };
  createdAt: string;
  user: { name: string; picture: string };
  inputNumber: number;
}

const Workspacetable: React.FC = () => {
  const { allHistoryData, isLoadingallHistory, isErrorallHistory } = useHistoryData();
  
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("createdAt");
  const [searchItem, setSearchItem] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");

 
  useEffect(() => {
    if (allHistoryData) {
      setFilteredData(allHistoryData);
    }
  }, [allHistoryData]);

  useEffect(() => {
    filterData();
  }, [searchItem, filterType, allHistoryData]);

  const filterData = () => {
    if (!allHistoryData) return;
    let filtered = [...allHistoryData];

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

    const sorted = [...filteredData].sort((a, b) => {
      let valueA: any = a[property];
      let valueB: any = b[property];

      if (property === "createdAt") {
        return isAsc
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
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

      return isAsc
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    setFilteredData(sorted);
  };

  if (isLoadingallHistory) {
    return <Typography>Loading history data...</Typography>;
  }

  if (isErrorallHistory) {
    return <Typography color="error">Error loading history data</Typography>;
  }

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
              <InputLabel id="filter-label" sx={{ position: "absolute", top: -8, background: "white", px: 0.5 }}>
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
                  <TableSortLabel
                    active={orderBy === "project"}
                    direction={orderBy === "project" ? order : "asc"}
                    onClick={() => handleRequestSort("project")}
                  >
                    ชื่อ Project
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    วันที่
                  </TableSortLabel>
                </TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "user"}
                    direction={orderBy === "user" ? order : "asc"}
                    onClick={() => handleRequestSort("user")}
                  >
                    ผู้อัปโหลด
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row) => (
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
                    </Typography>{"1"}
                    {row.project.input_type}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={getImageUrl(row.user.picture)} sx={{ width: 40, height: 40, mr: 1 }} />
                      <Typography>{row.user.name}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Workspacetable;
