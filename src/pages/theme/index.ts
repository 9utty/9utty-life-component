import { createTheme } from '@mui/material'
import DefaultPalette from './color'

export const theme = createTheme({
  palette: DefaultPalette('dark'),
  components: {
    MuiTextField: {
      defaultProps: {
        autoComplete: 'off'
      }
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: 'dunggeunmo-bold'
      }
    }
  }
})
