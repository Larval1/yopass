import { useTranslation } from 'react-i18next';
import { useForm, Controller, Control } from 'react-hook-form';
import randomString, {
  encryptMessage,
  isErrorWithMessage,
  postSecret,
} from '../utils/utils';
import { useState } from 'react';
import Result from '../displaySecret/Result';
import Error from '../shared/Error';
import Expiration from '../shared/Expiration';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  InputLabel,
  formControlClasses,
} from '@mui/material';
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-router-dom';
import Secret from '../displaySecret/Secret';
import Strength from '../shared/Strength';

const CreateSecret = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      generateDecryptionKey: true,
      secret: '',
      onetime: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    password: '',
    uuid: '',
    customPassword: false,
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.ctrlKey && event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  const [secret, setSecret] = useState("");

  const generatePassword = async (form: any): Promise<void> => {
    console.log(form.strength);
    var apiUrl = "";

    if (form.strength == "1")
      apiUrl = "https://makemeapassword.ligos.net/api/v1/alphanumeric/json?l=8";
    else if (form.strength == "2")
      apiUrl = "https://makemeapassword.ligos.net/api/v1/alphanumeric/json?l=10&sym=true";
    else if (form.strength == "3")
      apiUrl = "https://makemeapassword.ligos.net/api/v1/alphanumeric/json?l=20&sym=true";

    try {
      const fetched = await fetch(apiUrl);
      const temp = await fetched.json();
      setSecret(temp["pws"][0]);
    }
    catch(e) {
      console.log(e);
      setSecret(randomString());
    }
  } 

  const onSubmit = async (form: any): Promise<void> => {
    // Use the manually entered password, or generate one
    const pw = form.password ? form.password : randomString();
    setLoading(true);
    try {
      const { data, status } = await postSecret({
        expiration: parseInt(form.expiration),
        message: await encryptMessage(secret, pw),
        one_time: form.onetime,
      });
      
      if (status !== 200) {
        setError('secret', { type: 'submit', message: data.message });
      } else {
        setResult({
          customPassword: form.password ? true : false,
          password: pw,
          uuid: data.message,
        });
      }
    } catch (e) {
      if (isErrorWithMessage(e)) {
        setError('secret', {
          type: 'submit',
          message: e.message,
        });
      }
    }
    setLoading(false);
  };

  const generateDecryptionKey = watch('generateDecryptionKey');

  if (result.uuid) {
    return (
      <Result
        password={result.password}
        uuid={result.uuid}
        prefix="s"
        customPassword={result.customPassword}
      />
    );
  }
  return (
    <>
      <Error
        message={errors.secret?.message}
        onClick={() => clearErrors('secret')}
      />
      <Typography component="h1" variant="h4" align="center" sx={{fontWeight:600}}>
        {t('create.title')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center">
          <Grid container justifyContent="center">
            <Strength control={control} />
          </Grid>
          <Box pb={2}>
            <Button
                onClick={() => handleSubmit(generatePassword)()}
                variant="contained"
                disabled={loading}
                sx={{ 
                  borderRadius: "20px",
                  backgroundImage: "linear-gradient(45deg,#0096bb,#6cbe99)",
                  fontSize: "16px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft:"35px",
                  paddingRight: "35px",
                  fontWeight:'700'
                }}>
                  <span>{t('create.buttonCreateSecret')}</span>
              </Button>
          </Box>
          <Controller
            name="secret"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline={true}
                margin="dense"
                fullWidth
                label={t('create.inputSecretLabel')}
                rows="4"
                autoFocus={true}
                onKeyDown={onKeyDown}
                placeholder="..."
                inputProps={{ spellCheck: 'false', 'data-gramm': 'false' }}
                value={secret}
                onChange={e => setSecret(e.target.value)}
              />
            )}
          />
          <Grid container justifyContent="center">
            <Expiration control={control} />
          </Grid>
          <Grid container alignItems="center" direction="column">
            
            <SpecifyPasswordToggle control={control} />
            {!generateDecryptionKey && (
              <SpecifyPasswordInput control={control} />
            )}
            <OneTime control={control} />
          </Grid>
          <Grid container justifyContent="center">
            <Box>
              <Button
                onClick={() => handleSubmit(onSubmit)()}
                variant="contained"
                disabled={loading}
                sx={{ 
                  borderRadius: "20px",
                  backgroundImage: "linear-gradient(45deg,#0096bb,#6cbe99)",
                  fontSize: "16px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft:"35px",
                  paddingRight: "35px",
                  fontWeight:'700'
                }}
              >
                {loading ? (
                  <span>{t('create.buttonEncryptLoading')}</span>
                ) : (
                  <span>{t('create.buttonEncrypt')}</span>
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export const OneTime = (props: { control: Control<any> }) => {
  const { t } = useTranslation();

  return (
    <Grid item justifyContent="center" sx={{color:"#626d78"}}>
      <FormControlLabel
        control={
          <Controller
            name="onetime"
            control={props.control}
            render={({ field }) => (
              <Checkbox
                {...field}
                id="enable-onetime"
                defaultChecked={true}
                color="primary"
              />
            )}
          />
        }
        label={t('create.inputOneTimeLabel') as string}
      />
    </Grid>
  );
};

export const SpecifyPasswordInput = (props: { control: Control<any> }) => {
  const { t } = useTranslation();
  return (
    <Grid item justifyContent="center">
      <InputLabel sx={{color:"#626d78"}}>{t('create.inputPasswordLabel')}</InputLabel>
      <Controller
        name="password"
        control={props.control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="text"
            id="password"
            variant="outlined"
            inputProps={{
              autoComplete: 'off',
              spellCheck: 'false',
              'data-gramm': 'false',
            }}
          />
        )}
      />
    </Grid>
  );
};

export const SpecifyPasswordToggle = (props: { control: Control<any> }) => {
  const { t } = useTranslation();
  return (
    <FormGroup sx={{color:"#626d78"}}>
      <FormControlLabel
        control={
          <Controller
            name="generateDecryptionKey"
            control={props.control}
            render={({ field }) => (
              <Checkbox {...field} defaultChecked={true} color="primary" />
            )}
          />
        }
        label={t('create.inputGenerateLabel') as string}
      />
    </FormGroup>
  );
};

export default CreateSecret;
