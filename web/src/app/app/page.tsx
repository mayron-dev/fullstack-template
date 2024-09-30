import { env } from "@/env";
import { GetOrganizationUseCase } from "@/usecase";

const getOrganizationUseCase = new GetOrganizationUseCase(env.SERVER_URL);
const App = async () => {
  const res = await getOrganizationUseCase.execute();
  return (
    <div>
      App
    </div>
  );
}
 
export default App;