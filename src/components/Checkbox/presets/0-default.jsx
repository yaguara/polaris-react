import Checkbox from '../Checkbox';

const handleChange = (value) => {
  console.log(value);
};

export default (
  <Checkbox
    uxpId="avatar-1"
    checked
    label={"Help I'm trapped in a checkbox factory"}
  />
);
