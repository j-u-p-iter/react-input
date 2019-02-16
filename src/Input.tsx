import * as React from "react";

enum Type {
  TEXT = "text",
  PASSWORD = "password"
}

enum PropsToControl {
  VALUE = "value"
}

type ChangeEventHandler = React.ChangeEventHandler<HTMLInputElement>;

interface Props {
  name: string;
  type?: any;
  containerClassName?: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler;
  disabled?: boolean;
  prefixEl?: React.ReactNode;
  suffixEl?: React.ReactNode;
}

type AnyProp = keyof Props;

interface DefaultProps {
  defaultValue: "";
  type: Type.TEXT;
  prefixEl: null;
  suffixEl: null;
  onChange: () => void;
}

type PropsWithDefault = Props & DefaultProps;

interface State {
  value: string;
}

export const TEST_ID = "input";

export class Input extends React.PureComponent<Props, State> {
  public static defaultProps: DefaultProps = {
    defaultValue: "",
    type: Type.TEXT,
    prefixEl: null,
    suffixEl: null,
    onChange: () => {}
  };

  public isControlled = (prop: AnyProp): boolean => prop in this.props;

  public state: State = {
    value: (this.props as PropsWithDefault).defaultValue
  };

  // We don't write props value to state, when we deal with controlled components.
  // When props are changed - component will be rerendered with new prop value.
  // So, we just take this new value and use in `render` method.
  public getState(): State {
    return (Object.keys(this.state) as Array<keyof State>).reduce(
      (resultState: State, stateProp: keyof State) => {
        const stateFromProps = (this.props as PropsWithDefault)[stateProp];
        const stateFromState = this.state[stateProp];

        resultState[stateProp] = this.isControlled(stateProp)
          ? stateFromProps!
          : stateFromState;

        return resultState;
      },
      this.state
    );
  }

  public handleChange: ChangeEventHandler = event => {
    const {
      currentTarget: { value }
    } = event;

    const { onChange } = this.props as PropsWithDefault;

    if (this.isControlled(PropsToControl.VALUE)) {
      onChange(event);
    } else {
      this.setState(
        {
          value
        },
        () => onChange(event)
      );
    }
  };

  public render() {
    const { name, type, prefixEl, suffixEl, containerClassName } = this.props;

    const { value } = this.getState();

    return (
      <label className={containerClassName}>
        {prefixEl}
        <input
          type={type}
          name={name}
          value={value}
          onChange={this.handleChange}
          data-testid={TEST_ID}
        />
        {suffixEl}
      </label>
    );
  }
}
