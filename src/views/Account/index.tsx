import * as React from "react";
import { Layout, Text, Divider, TopNavigation } from "@ui-kitten/components";

function AccountScreen() {
  return (
    <>
      <TopNavigation title="Airgraft" alignment="center" />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h1">Account</Text>
      </Layout>
    </>
  );
}

export default AccountScreen;
