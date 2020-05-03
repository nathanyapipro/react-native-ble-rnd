import React, { memo, useEffect } from "react";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Button,
  Text,
  Label,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, $apiLogin } from "../../states/api";
import { ApiLoginParams } from "../../api";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Please enter your email to proceed."),
  password: yup.string().required(),
});

interface FormState {
  email?: string;
  password?: string;
}

function SignInScreen() {
  const dispatch = useDispatch();
  const apiLogin = useSelector($apiLogin);
  const { error } = apiLogin;
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState,
    control,
    setValue,
    clearError,
    setError,
  } = useForm<FormState>({
    validationSchema: schema,
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
    // nativeValidation: false,
  });

  useEffect(() => {
    register({ name: "email" }, { required: true });
    register({ name: "password" }, { required: true });
  }, [register]);

  const onSubmit = (data: FormState) => {
    clearError();
    dispatch(login(data as ApiLoginParams));
  };
  useEffect(() => {
    if (error) {
      setError("email", "api", "");
      setError("password", "api", "");
    }
  }, [error, setError]);

  return (
    <Container>
      <Content padder>
        <Form style={{ marginTop: 40, marginRight: 16 }}>
          <Item floatingLabel style={{ marginBottom: 24 }}>
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              onChangeText={(text) => setValue("email", text, true)}
            />
          </Item>
          <Item floatingLabel style={{ marginBottom: 24 }}>
            <Label>Password</Label>
            <Input onChangeText={(text) => setValue("password", text, true)} />
          </Item>
          <Button
            style={{
              marginTop: 40,
              marginLeft: 16,
              marginRight: 16,
              alignContent: "center",
              justifyContent: "center",
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text>Sign In</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

export default memo(SignInScreen);
