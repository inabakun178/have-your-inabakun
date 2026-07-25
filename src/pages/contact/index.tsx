import type { NextPage } from "next";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";

const Contact: NextPage = () => {
  return (
    <PageTemplate pageTitle="Contact">
      <div className="pt-[150px] md:pt-[200px]">
        <p className="text-center text-[18px] text-white/50 md:text-[30px]">
          フォーム制作中。
          <br />
          ご連絡はTwitterのDMにお願い致します。
        </p>
      </div>
    </PageTemplate>
  );
};

export default Contact;
