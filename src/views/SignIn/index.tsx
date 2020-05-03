import React, { memo, useEffect } from "react";
import {
  Input,
  Button,
  Text,
  Layout,
  TopNavigation,
  Divider,
} from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, $apiLogin } from "../../states/api";
import { ApiLoginParams } from "../../api";
import { StyleSheet } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    flex: 1,
  },
  title: {
    marginTop: 24,
    marginBottom: 64,
    textAlign: "center",
  },
  input: {
    marginBottom: 32,
  },
  button: {
    marginTop: 8,

    alignContent: "center",
    justifyContent: "center",
  },
});

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
    <Layout level="1" style={styles.container}>
      <TopNavigation title="Airgraft" alignment="center" />
      <Text category="h3" style={styles.title}>
        Sign In
      </Text>
      <Input
        style={styles.input}
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text, true)}
      />

      <Input
        style={styles.input}
        onChangeText={(text) => setValue("password", text, true)}
      />

      <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
        Sign In
      </Button>
    </Layout>
  );
}

export default memo(SignInScreen);
