import PageView from "./PageView";
import PostView from "./PostView";

export default function ContentView({ node }) {
  return node.__typename === "Page" ? (
    <PageView node={node} />
  ) : (
    <PostView node={node} />
  );
}
