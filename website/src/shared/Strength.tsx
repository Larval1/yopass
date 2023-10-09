import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

export const Strength = (props: { control: Control<any> }) => {
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset" margin="dense" sx={{ fontFamily:'Titillium Web' }}>
      <FormLabel sx={{textAlign:"center", color:"#626d78"}} component="legend">{t('strength.legend')}</FormLabel>
      <Controller
        rules={{ required: true }}
        control={props.control}
        defaultValue="2"
        name="strength"
        render={({ field }) => (
          <RadioGroup
            {...field}
            row
            sx={{
              justifyContent: 'center',
              color:"#626d78",
              root: {
                radioGroup: {
                  justifyContent: 'center',
                },
              },
            }}
          >
            <FormControlLabel
              labelPlacement="end"
              value="1"
              control={<Radio color="primary" />}
              label={t('strength.optionWeak') as string}
            />
            <FormControlLabel
              labelPlacement="end"
              value="2"
              control={<Radio color="primary" />}
              label={t('strength.optionNormal') as string}
            />
            <FormControlLabel
              labelPlacement="end"
              value="3"
              control={<Radio color="primary" />}
              label={t('strength.optionStrong') as string}
            />
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
export default Strength;
