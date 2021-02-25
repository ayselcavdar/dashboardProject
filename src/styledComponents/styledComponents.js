import styled from "styled-components";

export const ModalButton = styled.div`
cursor: pointer;
padding: 10px;
width: 100%;
border-radius: 2px;
background-color: ${(props) => (!props.selected ? "#f4f4f4" : "#172C49")};
color: ${(props) => (!props.selected ? "#172C49" : "white")};
margin-top: 10px;
border-color:transparent;
`;

export const DisabledButton = styled.button`
cursor: ${(props) => (props.disabled ? "not-allowed" : "cursor")};
background-color: #3da836;
border-radius:0.375rem;
color: white;
padding-left: 1.5rem;
padding-right: 1.5rem;
border-color:transparent;
`;

export const ModalAlertHeader = styled.h5`
font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold)
  29px/39px var(--unnamed-font-family-open-sans);
letter-spacing: var(--unnamed-character-spacing-0);
text-align: center;
font: normal normal bold 29px/39px Open Sans;
letter-spacing: 0px;
color: ${(props) => (props.success ? "#3DA836" : "#D92323")};
opacity: 1;
`;

export const ErrorBody = styled.p`
font: var(--unnamed-font-style-normal) normal normal 16px/22px
  var(--unnamed-font-family-open-sans);
letter-spacing: var(--unnamed-character-spacing-0);
text-align: center;
font: normal normal normal 16px/22px Open Sans;
letter-spacing: 0px;
color: #454f63;
opacity: 1;
`;

export const EventHeader = styled.h3`
font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold) 23px/32px var(--unnamed-font-family-open-sans);
letter-spacing: var(--unnamed-character-spacing-0);
text-align: left;
font: normal normal bold 23px/32px Open Sans;
letter-spacing: 0px;
color: #172C49;
opacity: 1;
`
export const MD8 = styled.div`
overflow: scroll;
height: 100vh;
`

export const TTH = styled.th`
font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold) 13px/18px var(--unnamed-font-family-open-sans);
letter-spacing: var(--unnamed-character-spacing-0);
text-align: left;
font: normal normal bold 13px/18px Open Sans;
letter-spacing: 0px;
color: #172C49;
`

export const TTD = styled.th`
font: var(--unnamed-font-style-normal) normal normal 13px/18px var(--unnamed-font-family-open-sans);
letter-spacing: var(--unnamed-character-spacing-0);
text-align: left;

font: normal normal normal 13px/18px Open Sans;
letter-spacing: 0px;
color: #172C49;`