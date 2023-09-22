import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainSidebar from './components/nav/MainSidebar';

const rToken = localStorage.getItem('token');

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

export default function MIHIntranet() {
  const columns = [
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_reg_no',
      headerName: 'ทะเบียนรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'status_id',
      headerName: 'สถานะ',
      flex: 1,
      minWidth: 70,
      renderCell: (params) =>
        params.row.status_id === 1 ? (
          <span className="badge rounded-pill bg-danger">ขอใช้รถ</span>
        ) : params.row.status_id === 2 ? (
          <span className="badge rounded-pill bg-warning">รออนุมัติ</span>
        ) : params.row.status_id === 3 ? (
          <span className="badge rounded-pill bg-success">อนุมัติ</span>
        ) : params.row.status_id === 4 ? (
          <span className="badge rounded-pill bg-primary">เสร็จสิ้น</span>
        ) : (
          <span className="badge rounded-pill bg-secondary">ยกเลิก</span>
        ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [sched, setSched] = useState([]);

  useEffect(() => {
    if (rToken !== null) {
      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getschedbydate/0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSched(data);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('cancelled');
          } else {
            console.error('Error:', error);
          }
        });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Main | MIH Center </title>
      </Helmet>

      <div>
        {localStorage.getItem('token') !== null ? (
          <>
            <MainHeader onOpenNav={() => setOpen(true)} />
            <MainSidebar name={'main'} openNav={open} onCloseNav={() => setOpen(false)} />
          </>
        ) : (
          ''
        )}
        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <section className="section dashboard">
            <div className="row">
              {/* <!-- Left side columns --> */}
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-12">
                    <div className="card recent-sales">
                      <div className="card-body">
                        <h5 className="card-title">ประกาศ / ใบสื่อสารองค์กรภายใน</h5>
                        <table className="table table-borderless table-hover">
                          <thead>
                            <tr>
                              <th scope="col">ประเภท</th>
                              <th scope="col">เลขที่</th>
                              <th scope="col">เรื่อง</th>
                              <th scope="col">วันที่</th>
                              <th scope="col">ฝ่าย</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* <tr>
                                                            <th scope="row" className="badge bg-primary">
                                                                <i className="bi bi-bookmark me-1" />ประกาศ
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td>
                                                                <a href="#">เรื่องประกาศ</a>
                                                            </td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>บริหาร</td>
                                                        </tr>
                                                        <tr />
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="badge bg-primary">
                                                                <i className="bi bi-bookmark me-1" />ประกาศ
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">เรื่องประกาศ</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>บริหาร</td>
                                                        </tr>
                                                        <tr />
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr> */}
                          </tbody>
                        </table>
                        (Coming soon)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">ข่าวสาร และกิจกรรม</h5>
                        <div className="news">
                          {/* <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div> */}
                          (Coming soon)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Right side columns --> */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body pb-5">
                    <h5 className="card-title">
                      รายการขอใช้ห้องประชุม <span>| ToDay</span>
                    </h5>
                    {/* <div className="activity">
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">11.00 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">13.30 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>
                                        </div> */}
                    (Coming soon)
                  </div>
                </div>
                <div className="card">
                  <div className="card-body pb-5">
                    <h5 className="card-title">
                      รายการขอใช้รถ <span>| ToDay</span>
                    </h5>
                    <div className="activity">
                      <StripedDataGrid
                        autoHeight
                        getRowHeight={() => 'auto'}
                        sx={{
                          [`& .${gridClasses.cell}`]: {
                            py: 1,
                          },
                        }}
                        columns={columns}
                        rows={sched}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 25, 100]}
                        hideFooterPagination
                        hideFooterSelectedRowCount
                        // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                        // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                        initialState={{
                          columns: {
                            columnVisibilityModel: {
                              // Hide columns status and traderName, the other columns will remain visible
                              // id: false,
                            },
                          },
                        }}
                        // components={{ Toolbar: QuickSearchToolbar }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body pb-5">
                    <h5 className="card-title">
                      ปฏิทินกิจกรรม <span>| This Month</span>
                    </h5>

                    <div className="activity">
                      {/* <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">คลีนนิ่งเดย์ ประจำเดือน</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-danger align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-primary align-self-start" />
                                                <div className="activity-content">
                                                    ประชุมคณะกรรมการความเสี่ยง
                                                </div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div> */}
                      (Coming soon)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
