import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  Box,
  TextField,
  colors,
  CircularProgress,
  MenuItem,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Grid
} from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { Label, StyledButton } from '..';
import { vaccineRegistrationSchema } from '../../pages/Admin/schema';
import {
  GetPersonalInformationByCitizenIdResult,
  VaccineRegistrationCreate
} from '../../pages/Admin/types';
import { useCreateVaccineRegistration } from '../../hooks/useVaccineRegistration';
import { useGetPersonalInformationByCitizenId } from '../../hooks/usePersonalInformation';
interface Props {
  onClose: () => void;
  handleRefetch: () => void;
}
export const ContentDialog = (props: Props) => {
  const { createVaccineRegistration } = useCreateVaccineRegistration();
  const { getPersonalInformationByCitizenId } =
    useGetPersonalInformationByCitizenId();
  const [citizenId, setCitizenId] = useState<string>('');
  const [searchResult, setSearchResult] =
    useState<GetPersonalInformationByCitizenIdResult>();
  const { onClose, handleRefetch } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { isValid }
  } = useForm<VaccineRegistrationCreate>({
    resolver: yupResolver(vaccineRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      status: undefined,
      personal_info_id: undefined
    }
  });
  const formSubmitHandler: SubmitHandler<VaccineRegistrationCreate> = async (
    data: VaccineRegistrationCreate
  ) => {
    setLoading(true);
    try {
      const response = await createVaccineRegistration(data);
      if (response.request.status === 201) {
        setLoading(false);
        handleRefetch();
        onClose();
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async () => {
    try {
      if (citizenId === '') {
        throw new Error('Citizen Id not found');
      }
      const result = await getPersonalInformationByCitizenId(citizenId);
      setSearchResult({
        citizen_id: result.data.citizen_id,
        full_name: result.data.full_name,
        phone_number: result.data.phone_number,
        dob: result.data.dob
      });
      setValue('personal_info_id', result.data.id);
      trigger();
    } catch (err) {
      setSearchResult(undefined);
    }
  };
  const handleChangeCitizenId = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCitizenId(e.target.value);
  };
  return (
    <>
      <Stack
        component="form"
        direction="column"
        onSubmit={handleSubmit(formSubmitHandler)}
        spacing={3}
        sx={{ px: 3, mt: 3 }}>
        <Box sx={{ width: '400px' }}>
          <Label required={true}>Tr???ng th??i</Label>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                fullWidth
                helperText={error?.message}
                error={invalid}
                {...field}
                sx={{ root: { height: '50px' }, mt: 1 }}
                select>
                <MenuItem value="Th??nh c??ng">Th??nh c??ng</MenuItem>
                <MenuItem value="Th???t b???i">Th???t b???i</MenuItem>
              </TextField>
            )}
          />
        </Box>
        <Box sx={{ width: '400px' }}>
          <Label required={false}>T??m ki???m th??ng tin c?? nh??n</Label>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              width: 400
            }}>
            <InputBase
              onChange={(e) => handleChangeCitizenId(e)}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Nh???p cmnd/c??n c?????c c??ng d??n"
            />
            <IconButton
              onClick={handleSearch}
              sx={{ p: '10px', borderRadius: '50%' }}
              aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        {searchResult ? (
          <Box sx={{ width: '400px' }}>
            <Typography variant="h5">K???t qu??? tra c???u: </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  S??? cmnd/c??n c?????c c??ng d??n:{' '}
                </Typography>
                <Box component="b">{searchResult.citizen_id}</Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">H??? t??n:</Typography>
                <Box component="b">{searchResult.full_name}</Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">S??? ??i???n tho???i:</Typography>
                <Box component="b">{searchResult.phone_number}</Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Ng??y sinh: </Typography>
                <Box component="b">{searchResult.dob.toLocaleString()}</Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ width: '400px' }}>
            <Typography variant="h5">Kh??ng c?? k???t qu???</Typography>
          </Box>
        )}
        <Box
          sx={{
            justifyContent: 'right',
            display: 'flex',
            width: '400px',
            mb: '16px !important'
          }}>
          <StyledButton
            sx={{
              border: 1,
              borderColor: colors.indigo['700'],
              color: colors.indigo['700'],
              background: '#fff',
              mr: 1
            }}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            onClick={onClose}>
            <Trans>H???y b???</Trans>
          </StyledButton>
          <StyledButton
            type="submit"
            sx={{
              background: colors.indigo['700'],
              color: '#fff',
              '&:hover': {
                background: colors.indigo['600']
              }
            }}
            variant="contained"
            disabled={!isValid || loading}
            startIcon={loading && <CircularProgress size={20} />}>
            <Trans>X??c nh???n</Trans>
          </StyledButton>
        </Box>
      </Stack>
    </>
  );
};
