import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import { formatBigValue, getEtherscanAddressUrl, shortenAddr } from 'web3/utils';

import Table from 'components/antd/table';
import ExternalLink from 'components/custom/externalLink';
import Identicon from 'components/custom/identicon';
import { Text } from 'components/custom/typography';
import { APIVoterEntity, fetchVoters } from 'modules/governance/api';

const Columns: ColumnsType<APIVoterEntity> = [
  {
    title: 'Address',
    dataIndex: 'address',
    render: (value: string) => (
      <div className="flex col-gap-16 align-center">
        <Identicon address={value} width={32} height={32} />
        <ExternalLink href={getEtherscanAddressUrl(value)} className="link-blue">
          <Text
            type="p1"
            weight="semibold"
            color="var(--gradient-blue-safe)"
            textGradient="var(--gradient-blue)"
            ellipsis
            className="hidden-mobile hidden-tablet">
            {value}
          </Text>
          <Text
            type="p1"
            weight="semibold"
            color="var(--gradient-blue-safe)"
            textGradient="var(--gradient-blue)"
            wrap={false}
            className="hidden-desktop">
            {shortenAddr(value)}
          </Text>
        </ExternalLink>
      </div>
    ),
  },
  {
    title: 'Staked Balance',
    dataIndex: 'bondStaked',
    width: 200,
    align: 'right',
    render: (value: BigNumber) => (
      <Text
        type="p1"
        weight="semibold"
        className="ml-auto"
        color="var(--gradient-red-safe)"
        textGradient="var(--gradient-red)">
        {formatBigValue(value, 2, '-', 2)}
      </Text>
    ),
  },
  {
    title: 'Voting Power',
    dataIndex: 'votingPower',
    width: 200,
    align: 'right',
    render: (value: BigNumber) => (
      <Text
        type="p1"
        weight="semibold"
        className="ml-auto"
        color="var(--gradient-red-safe)"
        textGradient="var(--gradient-red)">
        {formatBigValue(value, 2, '-', 2)}
      </Text>
    ),
  },
  {
    title: 'Votes',
    dataIndex: 'votes',
    width: 150,
    align: 'right',
    render: (value: number) => (
      <Text
        type="p1"
        weight="semibold"
        className="ml-auto"
        color="var(--gradient-green-safe)"
        textGradient="var(--gradient-green)">
        {value}
      </Text>
    ),
  },
  {
    title: 'Proposals',
    dataIndex: 'proposals',
    width: 150,
    align: 'right',
    render: (value: number) => (
      <Text
        type="p1"
        weight="semibold"
        className="ml-auto"
        color="var(--gradient-green-safe)"
        textGradient="var(--gradient-green)">
        {value}
      </Text>
    ),
  },
];

export type VotersTableProps = {
  className?: string;
};

const VotersTable: React.FC<VotersTableProps> = props => {
  const { className } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [voters, setVoters] = React.useState<APIVoterEntity[]>([]);
  const [totalVoters, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 10;

  React.useEffect(() => {
    setLoading(true);

    fetchVoters(page, pageSize)
      .then(data => {
        setVoters(data.data);
        setTotal(data.meta.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, pageSize]);

  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <Text type="p1" weight="semibold" color="primary">
          Voter weights
        </Text>
      </div>
      <Table<APIVoterEntity>
        inCard
        columns={Columns}
        dataSource={voters}
        rowKey="address"
        loading={loading}
        pagination={{
          total: totalVoters,
          pageSize,
          current: page,
          position: ['bottomRight'],
          showTotal: (total: number, [from, to]: [number, number]) => (
            <>
              <Text type="p2" weight="semibold" color="secondary" className="hidden-mobile">
                Showing {from} to {to} out of {total} stakers
              </Text>
              <Text type="p2" weight="semibold" color="secondary" className="hidden-tablet hidden-desktop">
                {from}..{to} of {total}
              </Text>
            </>
          ),
          onChange: setPage,
        }}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
};

export default VotersTable;
