import axios from 'axios';
import { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import moment from 'moment';
import { Formik, Form } from 'formik';
import {
  IconButton,
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import Scrollbar from '../Scrollbar';
import Iconify from '../Iconify';

const Export = ({ toggleFilter, applyFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [options, setOptions] = useState({ page, size });
  const [enquiryData, setEnquiryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enquiryCount, setEnquiryCount] = useState(0);

  const getEnquiryData = (options) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/queue/enquiry/export`, {
        params: options,
      })
      .then((res) => {
        console.log('exportData', res);
        if (res.data.isError === false) {
          setIsLoading(false);
          setEnquiryCount(res.data.data.maxRecords);
          setEnquiryData(res.data.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageChange = (event, newPage) => {
    const temp = { page: newPage, size };
    setPage(newPage);
    setIsLoading(true);
    getEnquiryData(temp);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPage(0);
    getEnquiryData();
  };
  const downloadDoc = async (e, id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/queue/enquiry/download?id=${id}`);
      window.open(res.data.data.url, '_blank');
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEnquiryData();
  }, [anchorEl]);

  return (
    <>
      <div>
        <Box style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={handleClick}>
            <Iconify style={{ fontSize: '24px', color: '#1b2859' }} icon="fa6-solid:list-check" />
            {/* <Typography variant="h6"> Exports</Typography> */}
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Box sx={{ minHeight: '100px' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sl No</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          endIcon={<Iconify style={{ fontSize: '24px' }} icon="ion:refresh-circle" />}
                          onClick={() => getEnquiryData(options)}
                        >
                          Refresh
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enquiryData?.map((item, id) => (
                      <TableRow key={id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell>{page * size + (id + 1)}</TableCell>
                        <TableCell>
                          <Stack direction={'column'}>
                            {moment(item.updatedAt).format('DD-MM-YY ')}
                            <Typography variant="caption"> {moment(item.updatedAt).format('hh:mm:ss a')}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell align="center">
                          {isLoading && (
                            <Iconify
                              sx={{ fontSize: '24px', cursor: 'pointer' }}
                              icon={'line-md:loading-twotone-loop'}
                            />
                          )}
                          {!isLoading && !item.isExpired && item.status === 'COMPLETED' ? (
                            <Iconify
                              onClick={(e) => downloadDoc(e, item?._id)}
                              sx={{ fontSize: '24px', cursor: 'pointer' }}
                              icon="eva:download-fill"
                            />
                          ) : (
                            <>{!isLoading && item.isExpired && 'Expired'}</>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[]}
                component={'div'}
                count={enquiryCount}
                showFirstButton
                showLastButton
                onPageChange={handlePageChange}
                rowsPerPage={size}
                page={page}
              />
            </Box>
          </Menu>
        </Box>
      </div>
    </>
  );
};

export default Export;
