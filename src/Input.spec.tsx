import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { Input, TEST_ID } from ".";

describe("Input", () => {
  afterEach(cleanup);

  it("renders properly by default", () => {
    const { container } = render(<Input name="some-name" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders properly with all props", () => {
    const props = {
      name: "some-name",
      type: "password",
      containerClassName: "some-container-class-name",
      defaultValue: "some default value",
      onChange: () => {},
      disabled: true,
      prefixEl: <span>Prefix element</span>,
      suffixEl: <em>Suffix element</em>
    };

    const { container } = render(<Input {...props} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  describe("in controlled mode", () => {
    let ControlledInput: any;
    const originalValue = "some value";

    beforeEach(() => {
      class Controlled extends React.PureComponent<any> {
        public state = {
          value: originalValue
        };

        public handleChange = ({ currentTarget: { value } }: any) => {
          this.setState({
            value
          });
        };

        public render() {
          const { value } = this.state;

          return (
            <Input name="input" onChange={this.handleChange} value={value} />
          );
        }
      }

      ControlledInput = Controlled;
    });

    it("updates state on Input correctly", () => {
      const newValue = "new value";

      const { getByTestId } = render(<ControlledInput />);

      expect((getByTestId(TEST_ID) as HTMLInputElement).value).toBe(
        originalValue
      );

      fireEvent.change(getByTestId(TEST_ID), { target: { value: newValue } });

      expect((getByTestId(TEST_ID) as HTMLInputElement).value).toBe(newValue);
    });
  });

  describe("in self controlled mode", () => {
    it("calls onChange with correct argument", () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <Input name="input" onChange={onChange} />
      );

      expect(onChange).toHaveBeenCalledTimes(0);

      fireEvent.change(getByTestId(TEST_ID), {
        target: { value: "new value" }
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].currentTarget).toBeDefined();
    });
  });

  describe("without onChange callback", () => {
    it("doesn't throw error", () => {
      const newValue = "new value";

      const { getByTestId } = render(<Input name="some-name" />);

      fireEvent.change(getByTestId(TEST_ID), { target: { value: newValue } });

      expect((getByTestId(TEST_ID) as HTMLInputElement).value).toBe(newValue);
    });
  });
});
