import ChoiceList from '../ChoiceList';

export default (
  <ChoiceList
    uxpId="choicelist-1"
    title="Choice name"
    choices={[
      {label: 'First', value: 'first'},
      {label: 'Second', value: 'second'},
      {label: 'Third', value: 'third'},
    ]}
    selected={['hidden']}
  />
);
