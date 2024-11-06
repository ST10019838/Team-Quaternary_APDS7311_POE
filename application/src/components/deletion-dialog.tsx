'use client'

import axios from '@/lib/axios'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog'

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/shadcn-ui/button'

import { Loader2, Trash2 } from 'lucide-react'
// import { useToast } from '@/hooks/use-toast';

interface Props<TData> {
  nameOfData: string
  dataId: string
  dataToDelete: TData
  dialogTrigger?: ReactNode
  isOpen?: boolean
  onOpenChanged?: (open: boolean) => void
  itemDeletion: UseMutationResult<void, Error, TData, unknown>
}

export default function DeletionDialog<TData>({
  nameOfData,
  dataId,
  dataToDelete,
  dialogTrigger,
  isOpen,
  onOpenChanged,
  itemDeletion,
}: Props<TData>) {
  return (
    <Dialog
      open={isOpen && (itemDeletion.isIdle || itemDeletion.isPending)}
      onOpenChange={onOpenChanged}
    >
      <DialogTrigger asChild>
        {dialogTrigger ? (
          dialogTrigger
        ) : (
          <Button variant="outline" className="w-full sm:w-max">
            Delete Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Delete <span className="capitalize">{nameOfData}</span>
          </DialogTitle>
          {/* <DialogDescription>Payment: {payment._id}</DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <span>
            Are you sure you want to{' '}
            <span className="text-red-500 underline">delete</span>{' '}
            <span className="lowercase">{nameOfData}:</span>{' '}
            <span className="capitalize">{dataId}</span> ?
          </span>

          {itemDeletion.isError && (
            <span className="text-red-500">{itemDeletion.error.message}</span>
          )}
        </div>
        <DialogFooter className="flex w-full flex-row gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-max">
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            className="w-full gap-2 sm:w-max"
            onClick={() => {
              itemDeletion.mutate(dataToDelete)
            }}
            disabled={itemDeletion.isPending}
          >
            {itemDeletion.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 />
                <span>Delete</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
