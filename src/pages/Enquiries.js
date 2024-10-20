import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
// material
import { styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  CircularProgress,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  OutlinedInput,
  InputAdornment,
  Tooltip,
  Popover,
  Chip,
} from '@mui/material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

import { Business, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filter from '../components/filters/Enquiries';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import Export from '../components/filters/EnquiryExport';

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

/// custom tablecell with custom padding
const TableCellCustom = styled(TableCell)(({ theme }) => ({
  padding: '14px 8px',
}));

export default function Enquiries() {
  const [enquiryData, setEnquiryData] = useState();
  const [name, setName] = useState('');
  const [pages, setPages] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState(10);
  const [options, setOptions] = useState({ size, page: 0 });
  const [input, setInput] = useState(1);
  const [isLoading1, setIsLoading1] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  const handlePageChange = (event, newPage) => {
    const temp = { ...options, page: newPage };
    setPages(newPage);
    setOptions(temp);
    setIsLoading(true);
    getEnquiries(temp);
  };

  const getEnquiries = (options) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/enquiry/all`, {
        params: options,
      })
      .then((res) => {
        console.log('res', res);
        if (res.data.isError === false) {
          setIsLoading(false);
          setEnquiryCount(res.data.data.maxRecords);
          setEnquiryData(res.data.data.records);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getEnquiriesWithoutLoading = (options) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/enquiry/all`, {
        params: options,
      })
      .then((res) => {
        console.log('res', res);
        if (res.data.isError === false) {
          setEnquiryCount(res.data.data.maxRecords);
          setEnquiryData(res.data.data.records);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const exportEnquiries = async (options) => {
    console.log(options);
    setIsLoading1(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_KEY}/enquiry/export`, options);
      console.log('res', res);
      setIsLoading1(false);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setIsLoading1(false);
      toast.success(error.response.data.message);
    }
  };

  const handleClick = (event, index) => {
    if (selectedMessageIndex === index) {
      setAnchorEl(null);
      setSelectedMessageIndex(null);
    } else {
      setAnchorEl(event.currentTarget);
      setSelectedMessageIndex(index);
    }
  };

  const open = Boolean(anchorEl);

  const onSearch = (e) => {
    e.preventDefault();
    setName(e.target.value);
    const temp = { ...options, page: 0, name: e.target.value };
    setOptions(temp);
    setPages(0);
    getEnquiriesWithoutLoading(temp);
  };

  const renderServiceForChip = (serviceFor) => {
    if (serviceFor === 'COMPANY') {
      return <Chip size="small" label={serviceFor} icon={<Business />} sx={{ textTransform: 'uppercase' }} />;
    }

    return <Chip size="small" label={serviceFor} icon={<Person />} sx={{ textTransform: 'uppercase' }} />;
  };

  const applyFilters = (filter) => {
    console.log('filter', filter);
    const temp = { page: 0, size };
    if (filter.name.length) {
      temp.name = filter.name;
    }
    if (filter.service.length) {
      temp.service = filter.service.trim();
    }
    if (filter.phone.length) {
      temp.phone = filter.phone;
    }
    if (filter.email.length) {
      temp.email = filter.email;
    }
    if (filter.startDate.length) {
      temp.startDate = filter.startDate;
    }
    if (filter.endDate.length) {
      temp.endDate = filter.endDate;
    }
    if (filter.organisation.length) {
      temp.organisation = filter.organisation;
    }

    setOptions(temp);
    setPages(0);
    getEnquiries(temp);
  };
  useEffect(() => {
    getEnquiries(options);
  }, []);

  useEffect(() => {
    const temp = { ...options, size, page: 0 };
    setPages(0);
    setOptions(temp);
    getEnquiries(temp);
  }, [size]);

  return (
    <>
      <Page title="Enquiries">
        {isLoading ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Container maxWidth="xl">
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Enquiries
                </Typography>
                <Stack direction="row" sx={{ width: '100%' }} justifyContent="end" alignItems={'center'} spacing={1}>
                  <Export />
                  <LoadingButton
                    endIcon={<Iconify icon="ph:export-bold" />}
                    variant="outlined"
                    onClick={() => exportEnquiries(options)}
                    loading={isLoading1}
                    size="small"
                  >
                    Export
                  </LoadingButton>
                </Stack>
              </Stack>
              <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  {/* <Stack direction="row" spacing={2} padding={2}>
                    <TextField
                      size="small"
                      style={{ maxWidth: '100px', maxHeight: '35px' }}
                      type="number"
                      component="div"
                      label="Go to"
                      value={input}
                      onInput={(e) => setInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={goToPage} style={{ maxHeight: '35px' }}>
                      Go
                    </Button>
                  </Stack> */}
                  <Stack direction="row" spacing={2} padding={2}>
                    <SearchStyle
                      value={name}
                      onChange={onSearch}
                      placeholder="Search by name..."
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                      }
                    />
                  </Stack>
                  <Stack padding={1} direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                    <Filter applyFilters={applyFilters} />
                  </Stack>
                </Stack>

                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCellCustom>Sl No</TableCellCustom>
                          <TableCellCustom>Date</TableCellCustom>
                          <TableCellCustom>Name</TableCellCustom>
                          <TableCellCustom>Email</TableCellCustom>
                          <TableCellCustom>Subject</TableCellCustom>
                          <TableCellCustom>Message</TableCellCustom>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {enquiryData?.map((item, id) => (
                          <TableRow
                            key={id}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                              },
                            }}
                          >
                            <TableCellCustom sx={{ maxWidth: '60px' }}>{pages * size + (id + 1)}</TableCellCustom>
                            <TableCellCustom sx={{ maxWidth: '100px' }}>
                              {moment(item.createdAt).format('DD/MM/YYYY')}
                            </TableCellCustom>
                            <TableCellCustom>{item?.name?.toUpperCase()}</TableCellCustom>
                            <TableCellCustom sx={{ maxWidth: '200px' }}>
                              <Typography sx={{ wordBreak: 'break-all' }} variant="body1">
                                {item.email}
                              </Typography>
                            </TableCellCustom>
                            <TableCellCustom sx={{ maxWidth: '100px' }}>{item.subject}</TableCellCustom>


                            <TableCellCustom
                              sx={{
                                maxWidth: '200px',
                              }}
                              onMouseEnter={item?.message?.length > 150 ? (event) => handleClick(event, id) : null}
                              onMouseLeave={() => {
                                setAnchorEl(null);
                                setSelectedMessageIndex(null);
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  cursor: 'pointer',
                                }}
                                aria-owns={open ? 'message-popover' : undefined}
                                aria-haspopup="true"
                              >
                                {item?.message?.length > 150 ? `${item?.message?.substring(0, 150)}...` : item?.message}
                              </Typography>
                              <Popover
                                id="message-popover"
                                open={open && selectedMessageIndex === id}
                                anchorEl={anchorEl}
                                onClose={() => {
                                  setAnchorEl(null);
                                  setSelectedMessageIndex(null);
                                }}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                sx={{
                                  '& .MuiPopover-paper': {
                                    maxWidth: '500px',
                                  },
                                  pointerEvents: 'none',
                                }}
                              >
                                <Typography sx={{ p: 1 }}>{item?.message}</Typography>
                              </Popover>
                            </TableCellCustom>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  onRowsPerPageChange={(e) => {
                    setSize(e.target.value);
                  }}
                  component={'div'}
                  count={enquiryCount}
                  showFirstButton
                  showLastButton
                  onPageChange={handlePageChange}
                  rowsPerPage={size}
                  page={pages}
                />
              </Card>
            </Container>
          </>
        )}
      </Page>
    </>
  );
}
