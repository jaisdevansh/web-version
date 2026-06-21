import ClientPage from './ClientPage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  return {
    title: `Event Details | Entry Club`,
    description: `Book your tickets for this event on Entry Club.`,
  };
}

export default async function Page(props: Props) {
  return (
    <ClientPage />
  );
}
