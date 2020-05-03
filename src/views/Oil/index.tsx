import * as React from "react";
import { Layout, Text, Divider, TopNavigation } from "@ui-kitten/components";

function OilScreen() {
  return (
    <>
      <TopNavigation title="Airgraft" alignment="center" />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h1">Oil</Text>
      </Layout>
    </>
  );
}

export default OilScreen;
