import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Button,
  Stack,
  Divider,
  Autocomplete,
  FormHelperText,
  Box,
} from '@mui/material';
// components
import CustomTextField from '../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../forms/theme-elements/CustomSelect';

const validationSchema = yup.object({
  type: yup.string().required('กรุณาระบุประเภทความเสี่ยง'),
  subType: yup.string().required('กรุณาระบุประเภทย่อยความเสี่ยงทางคลินิก'),
  riskDate: yup.string().required('กรุณาระบุวันที่เกิดเหตุ'),
  occurDept: yup.string().required('กรุณาระบุสถานที่'),
  HN: yup.string().required('กรุณาระบุ HN'), // กรณีเลือกประเภท(type)เป็น Non-Clinic ไม่บังคับ
  relDept: yup.string().required('กรุณาระบุหน่วยงานที่เกี่ยวข้อง'),
  Detail: yup.string().required('กรุณาระบุรายละเอียดความเสี่ยง'),
  Management: yup.string().required('กรุณาระบุการแก้ไขเบื้องต้น'),
  Suggestion: yup.string().required('กรุณาระบุข้อเสนอแนะ'),
});

let rToken = '';

function RMSNewTaskForm() {
  const [type, setType] = useState([]);
  const [subType, setSubType] = useState([]);
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_rmsPort}/type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setType(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_rmsPort}/subtype`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSubType(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_himsPort}/getalldept`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDepts(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      type: '',
      subType: '',
      riskDate: '',
      occurDept: '',
      HN: '',
      relDept: '',
      Detail: '',
      Management: '',
      Suggestion: '',
    },
    // validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  if (type.length === 0 || subType.length === 0 || depts.length === 0) {
    return <>loading...</>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack>
          <CardContent>
            <Typography variant="h5" mb={1}>
              บันทึกข้อมูลความเสี่ยง
            </Typography>
            <Divider sx={{ my: 3 }} />

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="type"
                  >
                    ประเภทความเสี่ยง
                  </CustomFormLabel>
                  <CustomSelect
                    labelId="type"
                    id="type"
                    fullWidth
                    name="type"
                    variant="outlined"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                  >
                    {type.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {formik.errors.type && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.type}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                {/* กรณีระบุประเภทความเสี่ยง = ความเสี่ยงทางคลินิก (Clinical) บังคับเลือก
                ประเภทย่อยความเสี่ยงทางคลินิก */}
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="subType"
                  >
                    ประเภทความเสี่ยงทางคลินิก
                  </CustomFormLabel>
                  <CustomSelect
                    labelId="subType"
                    id="subType"
                    fullWidth
                    name="subType"
                    variant="outlined"
                    value={formik.values.subType}
                    onChange={formik.handleChange}
                  >
                    {subType.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {formik.errors.subType && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.subType}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="Subject"
                  >
                    หัวข้อความเสี่ยง
                  </CustomFormLabel>
                  <CustomSelect
                    labelId="Subject-select"
                    id="Subject"
                    fullWidth
                    name="Subject"
                    variant="outlined"
                    // value={formik.values.Subject}
                    onChange={formik.handleChange}
                  >
                    {/* {subjects.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </CustomSelect>
                  {formik.errors.Subject && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.Subject}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="riskDate"
                  >
                    วันที่เกิดเหตุ
                  </CustomFormLabel>

                  <CustomTextField
                    labelId="riskDate-select"
                    id="riskDate"
                    fullWidth
                    name="riskDate"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {formik.errors.riskDate && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.riskDate}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="time"
                  >
                    เวลาที่เกิดเหตุ
                  </CustomFormLabel>

                  <CustomTextField
                    id="time"
                    type="time"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="occurDept"
                  >
                    สถานที่
                  </CustomFormLabel>
                  <CustomSelect
                    labelId="occurDept"
                    id="occurDept"
                    fullWidth
                    name="occurDept"
                    variant="outlined"
                    value={formik.values.occurDept}
                    onChange={formik.handleChange}
                  >
                    {depts.map((option) => (
                      <MenuItem key={option.dept_id} value={option.dept_id}>
                        {option.dept_name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {formik.errors.occurDept && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.occurDept}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="area"
                  >
                    บริเวณ
                  </CustomFormLabel>
                  <CustomTextField labelId="area" id="area" fullWidth name="area" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="hn"
                  >
                    HN
                  </CustomFormLabel>
                  <CustomTextField labelId="hn" id="hn" name="hn" variant="outlined" fullWidth />
                  {formik.errors.HN && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.HN}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="an"
                  >
                    AN
                  </CustomFormLabel>
                  <CustomTextField labelId="an" id="an" name="an" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="witness"
                  >
                    ผู้อยู่ในเหตุการณ์
                  </CustomFormLabel>
                  <CustomTextField labelId="witness" id="witness" name="witness" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-divs"
                  >
                    หน่วยงานที่เกี่ยวข้อง (ระบุได้มากกว่า 1 หน่วยงาน)
                  </CustomFormLabel>
                  <Autocomplete
                    labelId="relDept"
                    id="relDept"
                    fullWidth
                    name="relDept"
                    multiple
                    options={depts}
                    getOptionLabel={(option) => option.dept_name}
                    filterSelectedOptions
                    renderInput={(params) => <CustomTextField {...params} />}
                  />
                  {formik.errors.relDept && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.relDept}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="detail"
                  >
                    รายละเอียดความเสี่ยง
                  </CustomFormLabel>
                  <CustomTextField
                    labelId="detail"
                    id="detail"
                    name="detail"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                  {formik.errors.Detail && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.Detail}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="management"
                  >
                    การแก้ไขเบื้องต้น
                  </CustomFormLabel>
                  <CustomTextField
                    labelId="management"
                    id="management"
                    name="management"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                  {formik.errors.Management && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.Management}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="suggestion"
                  >
                    ข้อเสนอแนะ
                  </CustomFormLabel>
                  <CustomTextField
                    labelId="suggestion"
                    id="suggestion"
                    name="suggestion"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                  {formik.errors.Suggestion && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {formik.errors.Suggestion}{' '}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="file-upload"
                  >
                    แนบไฟล์
                  </CustomFormLabel>
                  <CustomTextField
                    id="file-upload"
                    type="file"
                    inputProps={{ accept: 'application/.jpeg' }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
                <Button size="large" variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button size="large" variant="text" color="error">
                  Cancel
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default RMSNewTaskForm;
