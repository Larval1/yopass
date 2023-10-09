import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCopyToClipboard } from 'react-use';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type ResultProps = {
  readonly uuid: string;
  readonly password: string;
  readonly prefix: 's' | 'f';
  readonly customPassword?: boolean;
};

const Result = ({ uuid, password, prefix, customPassword }: ResultProps) => {
  const base =
    (process.env.PUBLIC_URL ||
      `${window.location.protocol}//${window.location.host}`) + `/#/${prefix}`;
  const short = `${base}/${uuid}`;
  const full = `${short}/${password}`;
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" sx={{fontWeight:600}}>{t('result.title')}</Typography>
      <Typography sx={{color:"#626d78"}} mb={3}>
        {t('result.subtitleDownloadOnce')}
        <br />
        {t('result.subtitleChannel')}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {!customPassword && (
              <Row label={t('result.rowLabelOneClick')} value={full} />
            )}

            {customPassword && (
              <Row label={t('result.rowLabelShortLink')} value={short} />
            )}

            {customPassword && (
              <Row label={t('result.rowLabelDecryptionKey')} value={password} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

type RowProps = {
  readonly label: string;
  readonly value: string;
};

const Row = ({ label, value }: RowProps) => {
  const [copy, copyToClipboard] = useCopyToClipboard();
  return (
    <TableRow key={label}>
      <TableCell width="15">
        <Button
          sx={{backgroundImage: "linear-gradient(45deg,#0096bb,#6cbe99)"}}
          variant="contained"
          onClick={() => copyToClipboard(value)}
        >
          <FontAwesomeIcon icon={faCopy} />
        </Button>
      </TableCell>
      <TableCell width="100" padding="none">
        <strong>{label}</strong>
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
};

export default Result;
