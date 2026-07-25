import { ReactNode } from "react";
import Head from "next/head";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import SnsList from "../SnsList/SnsList";
import ParticleBackdrop from "../ParticleBackdrop/ParticleBackdrop";
import { motion } from "framer-motion";

const SITE_URL = "https://www.inabakun.com";
const SITE_NAME = "Have Your Inabakun";
const DEFAULT_DESCRIPTION =
  "フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のポートフォリオサイト「Have Your Inabakun」。伊豆出身、東京在住。経歴やスキルを紹介しています。";

type PageTemplateProps = {
  // サブページのタイトル。指定すると "${pageTitle} | Have Your Inabakun" になる
  pageTitle?: string;
  // タイトルをサフィックスなしで完全に上書きしたいときに使う(未指定なら pageTitle から組み立て)
  title?: string;
  // 省略時はサイト共通の説明文
  description?: string;
  // 絶対URLの組み立てに使うパス。"/profile" のように先頭は "/"
  canonicalPath?: string;
  // 404 など検索結果に出したくないページで true にする
  noIndex?: boolean;
  children: ReactNode;
};

const PageTemplate = ({
  pageTitle,
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
  noIndex = false,
  children,
}: PageTemplateProps) => {
  const pageFullTitle =
    title ?? (pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const ogImageUrl = `${SITE_URL}/ogp.jpg`;

  return (
    <>
      <Head>
        <title>{pageFullTitle}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
          rel="stylesheet"
        ></link>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        {noIndex && <meta name="robots" content="noindex,nofollow" />}

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageFullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageFullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@dev_inabakun" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "稲葉勇人",
              alternateName: "イナバくん",
              jobTitle: "Front-end Engineer / Designer",
              url: SITE_URL,
              image: ogImageUrl,
              sameAs: [
                "https://twitter.com/dev_inabakun",
                "https://github.com/inabakun178",
                "https://www.instagram.com/purupuruboy2",
              ],
            }),
          }}
        />
      </Head>
      {/*
       * before: は背景（public/site_bg.svg）をグレースケールで画面に固定するもの。
       * その上に同じ写真からサンプリングしたパーティクルを ParticleBackdrop で重ねる。
       */}
      <div className="bg-background-main relative mx-auto min-h-screen w-full max-w-full px-[15px] before:fixed before:top-0 before:left-0 before:h-screen before:w-screen before:animate-bg-zoom before:bg-[url('/site_bg.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:content-[''] md:px-[50px]">
        <ParticleBackdrop />
        <HeaderNavigation />
        <SnsList />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PageTemplate;
