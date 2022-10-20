import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';



const blue = {
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5'
  };
  
  const grey = {
    200: '#d0d7de',
    700: '#424a53',
  };

  const Tab = styled(TabUnstyled)`
        font-family: IBM Plex Sans, sans-serif;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        background-color: transparent;
        width: 100%;
        padding: 10px 12px;
        margin: 6px;
        border: none;
        border-radius: 7px;
        text-align:center;
      
        &.${tabUnstyledClasses.selected} {
          background-color: #fff;
          color: ${blue[600]};
        }
      
        &.${buttonUnstyledClasses.disabled} {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;

      const TabPanel = styled(TabPanelUnstyled)(
        ({ theme }) => `
        width: 98%;
        font-family: IBM Plex Sans, sans-serif;
        font-size: 0.875rem;
        padding: 20px 12px;
        background: '#fff';
        border: 1px solid ${grey[200]};
        border-radius: 12px;
        opacity: 0.6;
        `,
      );

      const TabsList = styled(TabsListUnstyled)(
        ({ theme }) => `
        min-width: 200px;
        width:500px;
        background-color: darkgrey;
        border-radius: 12px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: space-between;
        box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
        `,
      );

  export {
     Tab, TabPanel, TabsList
  }