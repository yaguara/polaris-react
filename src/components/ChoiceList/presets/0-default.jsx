import ChoiceList from '../ChoiceList';

export default (
  <ChoiceList
    title="Company name"
    choices={[
      {label: 'Hidden', value: 'hidden'},
      {label: 'Optional', value: 'optional'},
      {label: 'Required', value: 'required'},
    ]}
    selected={['hidden']}
  />
);
