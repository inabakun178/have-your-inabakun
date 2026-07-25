import type { Metadata } from "next";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";
import { buildMetadata } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "404 Not Found",
  description: "お探しのページは見つかりませんでした。",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <PageTemplate>
      <p className="text-center text-[120px] text-white/50 md:text-[300px]">
        404
      </p>
    </PageTemplate>
  );
}
