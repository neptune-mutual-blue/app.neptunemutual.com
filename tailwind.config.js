module.exports = {
  content: ['./lib/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '600px',
      md: '768px',
      lg: '992px',
      xl: '1200px'
    },
    boxShadow: {
      0: '0 0 #0000',
      card: '0px 6px 8px 0px rgba(0, 0, 0, 0.1)',
      mainCard:
        '0 3px 3px 0 rgb(162, 166, 218, 0.05), 0 30px 60px -30px #a2a6da',
      toolTip: '0px 2px 6px rgba(0, 0, 0, 0.25)',
      option: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      homeCard: '0px 12px 16px rgba(0, 0, 0, 0.04)',
      'hc-tooltip': '0px 5px 13px rgba(0, 0, 0, 0.1)',
      'tx-overview': '0px 4px 11px rgba(1, 5, 45, 0.3)',
      'tx-list': '0px 4px 12px rgba(0, 0, 0, 0.4)'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#01052d',
      white: '#fefeff',
      skeleton: 'rgb(226 232 240)'
    },
    fontSize: {
      h1: ['33px', '48px'],
      h2: ['28px', '40px'],
      h3: ['23px', '32px'],
      h4: ['19px', '24px'],
      h5: ['16px', '24px'],
      h6: [
        '16px',
        {
          letterSpacing: '0.05em',
          lineHeight: '24px'
        }
      ],
      h7: ['13px', '16px'],
      sm: ['14px', '16px'],
      lg: '18px',
      xxs: ['10px', '8px'],
      xs: [
        '12px',
        {
          letterSpacing: '0.05em',
          lineHeight: '24px'
        }
      ],
      para: ['16px', '28px'],
      cta: [
        '15px',
        {
          letterSpacing: '0.05em',
          lineHeight: '16px'
        }
      ],
      xxxl: '136px',
      xxl: '40px',
      'receipt-info': ['24px', '36px']
    },
    fontFamily: {
      poppins: 'Poppins, sans-serif',
      sora: 'Sora, sans-serif'
    },
    extend: {
      borderRadius: {
        1: '4px',
        big: '0.625rem',
        mdlg: '7px',
        tooltip: '10px'
      },
      borderWidth: {
        0.5: '0.5px',
        1.5: '1.5px'
      },
      boxShadow: {
        actionCard: '0px 4px 64px rgba(78, 125, 217, 0.4)',
        coverCard: '0px 6px 8px rgba(0, 0, 0, 0.1)'
      },
      flex: {
        2: '2 2 0%'
      },
      spacing: {
        /* 72px */
        9.5: '38px',
        13: '52px',
        42: '168px',
        54: '216px',
        18: '4.5rem',
        19: '4.75rem',
        '22px': '22px',
        '2.5px': '2.5px',
        '15%': '15%',
        '80%': '80%',
        0.75: '0.175rem'
      },
      lineHeight: {
        4.5: '18px',
        '53px': '53px'
      },
      maxWidth: {
        180: '180px',
        15: '15rem',
        52: '208px',
        56: '224px',
        60: '240px',
        '90vw': '90vw'
      },
      minWidth: {
        sm: '384px',
        5: '5px',
        60: '60px',
        120: '120px',
        300: '300px',
        345: '345px',
        400: '400px',
        500: '500px',
        550: '550px',
        600: '600px',
        700: '700px',
        910: '910px',
        '40vh': '40vh'
      },
      colors: {
        '999BAB': '#999BAB',
        '728FB2': '#728FB2',
        '4e7dd9': '#4e7dd9',
        f1f3f6: '#f1f3f6',
        EEEEEE: '#EEEEEE',
        F4F8FC: '#F4F8FC',
        '5F5F5F': '#5F5F5F',
        '9B9B9B': '#9B9B9B',
        '7398C0': '#7398C0',
        '89A0C2': '#89A0C2',
        e6f0fe: '#e6f0fe',
        e2ebf6: '#e2ebf6',
        364253: '#364253',
        DEEAF6: '#DEEAF6',
        B0C4DB: '#B0C4DB',
        DAE2EB: '#DAE2EB',
        CEEBED: '#CEEBED',
        '21AD8C': '#21AD8C',
        FA5C2F: '#FA5C2F',
        '15aac8': '#15aac8',
        d4dfee: '#d4dfee',
        E5E5E5: '#e5e5e5',
        AABDCB: '#AABDCB',
        E8E8ED: '#E8E8ED',
        '0FB88F': '#0FB88F',
        CDD6E3: '#CDD6E3',
        404040: '#404040',
        '8F949C': '#8F949C',
        '3A4557': '#3A4557',
        '016D8E': '#016D8E',
        DC2121: '#DC2121',
        940000: '#940000',
        E52E2E: '#E52E2E',
        '4289F2': '#4289F2',
        FEFEFF: '#FEFEFF',
        '01052D': '#01052D',
        '5C738F': '#5C738F',
        '404A5C': '#404A5C',
        EEF4FF: '#EEF4FF',
        F7E2BE: '#F7E2BE',
        E5F4F5: '#E5F4F5',
        FEEBE6: '#FEEBE6',
        '000000': '#000000',
        E6EAEF: '#E6EAEF'
      },
      minHeight: {
        360: '360px',
        301: '301px',
        72: '72px'
      },
      maxHeight: {
        144: '36rem',
        '90vh': '90vh',
        '100vh': '100vh',
        '30vh': '30vh',
        '45vh': '45vh',
        'tx-list': 'min(calc(100vh - 170px), 34rem)',
        'tx-list-mobile': 'calc(100vh - 262px)',
        '50vh': '50vh'
      },
      height: {
        500: '500px',
        '100vh': '100vh',
        0.75: '0.175rem'
      },
      width: {
        800: '800px'
      },
      backgroundImage: {
        '404-background': "url('/404_bg.svg')",
        'gradient-bg': 'url(/gradient.svg)'
      },
      transitionTimingFunction: {
        menu: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      zIndex: {
        60: '60'
      },
      opacity: {
        15: '.15'
      },
      gridTemplateRows: {
        'basket-modal': 'auto 1fr auto'
      }
    }
  },
  plugins: []
}
