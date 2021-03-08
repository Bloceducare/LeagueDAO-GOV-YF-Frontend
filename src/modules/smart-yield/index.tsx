import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Tabs from 'components/antd/tabs';
import Icon from 'components/custom/icon';
import { useWallet } from 'wallets/wallet';

import PoolProvider from './providers/pool-provider';
import PoolsProvider from './providers/pools-provider';
import DepositView from './views/deposit-view';
import MarketsView from './views/markets-view';
import PortfolioView from './views/portfolio-view';
import WithdrawView from './views/withdraw-view';

import s from './s.module.scss';

type SmartYieldViewParams = {
  vt: string;
};

const SmartYieldView: React.FC = () => {
  const history = useHistory();
  const {
    params: { vt = 'markets' },
  } = useRouteMatch<SmartYieldViewParams>();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = React.useState<string>(vt);

  function handleTabChange(tabKey: string) {
    setActiveTab(tabKey);
    history.push(`/smart-yield/${tabKey}`);
  }

  React.useEffect(() => {
    if (vt === 'deposit') {
      setActiveTab('markets');
      return;
    }
    if (vt === 'withdraw') {
      setActiveTab('portfolio');
      return;
    }

    if (vt !== activeTab) {
      setActiveTab(vt);
    }
  }, [vt]);

  return (
    <>
      <Tabs className={s.tabs} activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.Tab
          key="markets"
          tab={
            <>
              <Icon name="bar-charts-outlined" /> Markets
            </>
          }
        />
        <Tabs.Tab
          key="portfolio"
          disabled={!wallet.account}
          tab={
            <>
              <Icon name="wallet-outlined" /> Portfolio
            </>
          }
        />
      </Tabs>
      <div className="content-container">
        <Switch>
          <Route
            path="/smart-yield/:path(markets|portfolio)"
            render={() => (
              <PoolsProvider>
                <Route path="/smart-yield/markets" exact component={MarketsView} />
                {wallet.initialized && (
                  <>
                    {wallet.isActive ? (
                      <Route path="/smart-yield/portfolio" component={PortfolioView} />
                    ) : (
                      <Redirect to="/smart-yield/markets" />
                    )}
                  </>
                )}
              </PoolsProvider>
            )}
          />
          <Route
            path="/smart-yield/:path(deposit|withdraw)"
            render={() =>
              wallet.initialized && (
                <>
                  {wallet.isActive ? (
                    <PoolProvider>
                      <Route path="/smart-yield/deposit" component={DepositView} />
                      <Route path="/smart-yield/withdraw" component={WithdrawView} />
                    </PoolProvider>
                  ) : (
                    <Redirect to="/smart-yield/markets" />
                  )}
                </>
              )
            }
          />
          <Redirect to="/smart-yield/markets" />
        </Switch>
      </div>
    </>
  );
};

export default SmartYieldView;
