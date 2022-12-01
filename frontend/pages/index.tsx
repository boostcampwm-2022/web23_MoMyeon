import styles from 'styles/Home.module.scss';
import Header from 'components/header/header.component';
import HomeHead from 'head/home';
import getPosts from 'utils/api/getPosts';
import getAllCategory from 'utils/api/getAllCategory';
import PostContainer from 'components/mainPost/postContainer.component';
import CategoryContainer from 'components/mainFilter/categoryContainer.component';
import { GetServerSideProps, NextPage } from "next";
import { GithubCodeProps } from "types/auth";
import { CategoryProps, Category, CategoryParentProps } from "types/category";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGithubLoginMutation } from '../utils/hooks/useGithubLoginMutation';
import { useRouter } from 'next/router';

const Home: NextPage<GithubCodeProps & CategoryProps & CategoryParentProps> = ({
  code,
  category,
  categoryKey,
}) => {
  const mutation = useGithubLoginMutation(code);
  const router = useRouter();

  useEffect(() => {
    if (code !== null) {
      mutation.mutate(code);
    }
  }, []);

  useEffect(() => {
    if (!mutation.isSuccess) {
      return;
    }
    const reload = async () => {
      await router.replace('/');
      await router.reload();
    };
    reload();
  }, [mutation.isSuccess]);

  return (
    <div className={styles.main}>
      <HomeHead />
      <Header />
      <CategoryContainer category={category} categoryKey={categoryKey} />
      <PostContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query.code ?? null;

  const queryClient = new QueryClient();

  const [_, category] = await Promise.allSettled([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["posts"],
      queryFn: () => getPosts({ pageParam: 0, category: [], search: "" }),
    }),
    getAllCategory(),
  ]);

  const hydrate: any = dehydrate(queryClient);
  if (hydrate.queries[0]) {
    hydrate.queries[0].state.data.pageParams[0] = 0;
  }

  const value =
    category.status === 'fulfilled'
      ? category.value
      : [{ id: -1, name: "잘못된응답", subjecj: "잘못된응답" }];

  const keyTemp: string[] = [];
  const tableTemp: any = {};

  if (category.status === "fulfilled") {
    value.forEach((item: Category) => {
      const { id, name, subjecj } = item;
      if (tableTemp[subjecj]) {
        tableTemp[subjecj] = [...tableTemp[subjecj], { id, name, subjecj }];
        return;
      }
      tableTemp[subjecj] = [{ id, name, subjecj }];
      keyTemp.push(subjecj);
    });
  }

  return {
    props: {
      dehydratedState: hydrate,
      categoryKey: keyTemp,
      category: tableTemp,
      code: code,
    },
  };
};

export default Home;
