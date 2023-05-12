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
      'display-2xl': ['4.5rem', { lineHeight: '5.625', letterSpacing: '-0.02em' }], // 72px | 405px
      'display-xl': ['3.75rem', { lineHeight: '4.5', letterSpacing: '-0.02em' }], // 60px | 270px
      'display-lg': ['3rem', { lineHeight: '3.75', letterSpacing: '-0.02em' }], // 48px | 180px
      'display-md': ['2.25rem', { lineHeight: '1.22', letterSpacing: '-0.02em' }], // 36px | 44px
      'display-sm': ['1.875rem', { lineHeight: '1.26' }], // 30px | 38px
      'display-xs': ['1.5rem', { lineHeight: '1.3' }], // 24px | 32px
      xl: ['1.25rem', { lineHeight: '1.5' }], // 20px | 30px
      lg: ['1.125rem', { lineHeight: '1.55' }], // 18px | 28px
      md: ['1rem', { lineHeight: '1.5' }], // 16px | 24px
      sm: ['0.875rem', { lineHeight: '1.428' }], // 14px | 20px
      xs: ['0.75rem', { lineHeight: '1.5' }], // 12px | 18px
      xxs: ['10px', '8px'],
      xxxl: '136px',
      xxl: ['88px', '106px'],
      badge: ['11px', '13px']
    },
    fontFamily: {
      inter: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",sans-serif',
      arial: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",sans-serif'
    },
    extend: {
      letterSpacing: {
        2: '0.02em'
      },
      borderRadius: {
        1: '4px',
        2: '8px',
        big: '0.625rem',
        mdlg: '7px',
        tooltip: '10px',
        20: '20px'
      },
      borderWidth: {
        1: '1px',
        0.5: '0.5px',
        1.5: '1.5px'
      },
      boxShadow: {
        dropdown: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        actionCard: '0px 4px 64px rgba(78, 125, 217, 0.4)',
        coverCard: '0px 6px 8px rgba(0, 0, 0, 0.1)',
        lightCard: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'cover-dropdown': '0px 4px 11px rgba(0, 0, 0, 0.06)'
      },
      flex: {
        2: '2 2 0%'
      },
      spacing: {
        /* 72px */
        4.5: '18px',
        6.5: '26px',
        '9px': '9px',
        8.5: '34px',
        9.5: '38px',
        13: '52px',
        42: '168px',
        54: '216px',
        18: '4.5rem',
        19: '4.75rem',
        27: '6.75rem',
        '22px': '22px',
        '2.5px': '2.5px',
        '15%': '15%',
        '80%': '80%',
        0.75: '0.175rem',
        dropdown: 'calc(100% + 8px)',
        /* For analytics segment, implementing the spacing */
        '25px': '25px',
        '524px': '524px',
        400: '400px',
        420: '420px',
        392: '392px',
        450: '450px'
      },
      lineHeight: {
        4.5: '18px',
        5: '20px',
        7.5: '30px',
        '53px': '53px'
      },
      maxWidth: {
        180: '180px',
        9: '9rem',
        11: '11rem',
        15: '15rem',
        52: '208px',
        56: '224px',
        60: '240px',
        70: '282px',
        420: '420px',
        '90vw': '90vw',
        632: '632px'
      },
      minWidth: {
        auto: 'auto',
        sm: '384px',
        5: '5px',
        60: '60px',
        120: '120px',
        205: '205px',
        250: '250px',
        300: '300px',
        345: '345px',
        400: '400px',
        416: '416px',
        500: '500px',
        550: '550px',
        600: '600px',
        700: '700px',
        910: '910px',
        '40vh': '40vh',
        '50vw': '50vw',
        '60vw': '60vw',
        '75vw': '75vw',
        '90vw': '90vw',
        '100vw': '100vw',
        'analytics-stat': '99.2px'
      },
      colors: {
        '999BAB': '#999BAB',
        '728FB2': '#728FB2',
        '4e7dd9': '#4e7dd9',
        f6f7f9: '#F6F7F9',
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
        E6EAEF: '#E6EAEF',
        F5F9FC: '#F5F9FC',
        '2151B0': '#2151B0',
        '003fbd': '#003FBD',
        E03636: '#E03636',
        '5D52DC': '#5D52DC',
        F3F5F7: '#F3F5F7',
        D9D9D9: '#D9D9D9',
        '5E6C83': '#5E6C83',
        '1D9AEE': '#1D9AEE',
        667085: '#667085',
        '1D2939': '#1D2939',
        F9FAFA: '#F9FAFA',
        '4B7EE1': '#4B7EE1',
        EAF7F8: '#EAF7F8',
        D6D6D6: '#D6D6D6'
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
        'tx-list': 'min(calc(100vh - 270px), 34rem)',
        'tx-list-mobile': 'calc(100vh - 262px)',
        '50vh': '50vh'
      },
      height: {
        500: '500px',
        '100vh': '100vh',
        0.75: '0.175rem',
        391: '391px',
        435: '435px'
      },
      width: {
        800: '800px',
        '105px': '105px',
        616: '616px',
        324: '324px'
      },
      backgroundImage: {
        '404-background': "url('/404_bg.svg')",
        'gradient-big': 'url(/gradient-big.svg)',
        'gradient-slim': 'url(/gradient-slim.svg)',
        'dashed-border': 'linear-gradient(to right, #B0C4DB 50%, transparent 50%)'
      },
      backgroundSize: {
        'dashed-size': '20px'
      },
      transitionTimingFunction: {
        menu: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      zIndex: {
        60: '60'
      },
      gridTemplateRows: {
        'basket-modal': 'auto 1fr auto',
        'analytics-card': 'auto 1fr'
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
        'analytics-stat-cards': '1fr 1fr 1fr'
      }
    }
  },
  plugins: []
}
