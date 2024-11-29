import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { helper } from "@/lib/helper";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";

const Transactions = observer(() => {
  const { transaction, token } = useStore();
  const params = useParams();

  const formatTimeAgo = (timestamp: string) => {
    const now = dayjs();
    const time = dayjs.utc(Number(timestamp) * 1000);
    const diffInHours = now.diff(time, "hour");
    const diffInDays = now.diff(time, "day");

    if (diffInDays > 0) {
      return `${diffInDays}d ${diffInHours % 24}h ago`;
    } else {
      return `${diffInHours}h ${now.diff(time, "minute") % 60}m ago`;
    }
  };

  const handlePrevious = () => {
    if (transaction.transactionPage > 1) {
      transaction.setData({
        transactionPage: transaction.transactionPage - 1,
      });
    }
    transaction.fetchTransactionList.execute(params.mint as string);
  };

  const handleNext = () => {
    transaction.setData({
      transactionPage: transaction.transactionPage + 1,
    });
    transaction.fetchTransactionList.execute(params.mint as string);
  };

  useEffect(() => {
    transaction.fetchTransactionList.execute(params.mint as string);
  }, [params.mint]);

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <div className="text-xl mb-4">Transactions</div>
        <Icon icon="ic:outline-refresh" fontSize={20} className="text-primary cursor-pointer" onClick={() => transaction.fetchTransactionList.execute(params.mint as string)} />
      </div>
      <Table aria-label="Example static collection table" color="primary">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>{token?.detail?.symbol}</TableColumn>
          <TableColumn>WIOTX</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Maker</TableColumn>
          <TableColumn>Txn</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Transcations."}>
          {transaction.fetchTransactionList?.loading?.value ? (
            <>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => {
                return (
                  <TableRow key={item}>
                    {Array.from({ length: 7 }, (_, i) => i + 1).map((o) => {
                      return (
                        <TableCell key={`skeleton` + o}>
                          <Skeleton className="w-full h-[20px] rounded-md" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </>
          ) : (
            <>
              {transaction.fetchTransactionList.value?.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="text-sm w-max">{formatTimeAgo(item.timestamp)}</div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{new BigNumber(item.tokenAmount).dividedBy(10 ** 18).toFixed(2)}</TableCell>
                    <TableCell>{new BigNumber(item.iotxAmount).dividedBy(10 ** 18).toFixed(2)}</TableCell>
                    <TableCell>{Number(token?.detail?.price).toFixed(6)}</TableCell>
                    <TableCell>{helper.shortaddress(item.user || "...")}</TableCell>
                    <TableCell>
                      <Link className="text-primary underline" target="blank" href={`https://iotexscan.io/tx/${item.id}`}>
                        <Icon icon="eva:external-link-outline" fontSize={20} className="text-primary cursor-pointer" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>

      <div className="w-full flex items-center justify-end gap-6 my-6">
        <Button isIconOnly onClick={handlePrevious} size="sm" color="primary" isDisabled={transaction.transactionPage === 1 || transaction.fetchTransactionList.loading.value}>
          <Icon icon="fe:arrow-left" width="1.2rem" height="1.2rem" />
        </Button>
        <div className="text-center text-sm font-semibold">Page: {transaction.transactionPage}</div>
        <Button isIconOnly onClick={handleNext} size="sm" color="primary" isDisabled={(transaction.fetchTransactionList.value?.length || 0) < transaction.transactionLimit || transaction.fetchTransactionList.loading.value}>
          <Icon icon="fe:arrow-right" width="1.2rem" height="1.2rem" />
        </Button>
      </div>
    </div>
  );
});

export default Transactions;
