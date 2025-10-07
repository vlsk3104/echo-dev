"use client";
import Bowser from "bowser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { useQuery } from "convex/react";
import { ClockIcon, GlobeIcon, MailIcon, MonitorIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type InfoItem = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

type InfoSection = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
};

export const ContactPanel = () => {
  const params = useParams();
  const conversationId = params.conversationId as Id<"conversations"> | null;

  const contactSession = useQuery(
    api.private.contactSession.getOneByConversationId,
    conversationId ? { conversationId } : "skip",
  );

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent) {
        return { browser: "不明", os: "不明", device: "不明" };
      }

      const parser = Bowser.getParser(userAgent);
      const result = parser.getResult();

      return {
        browser: result.browser.name || "不明",
        browserVersion: result.browser.version || "",
        os: result.os.name || "不明",
        osVersion: result.os.version || "",
        device: result.platform.type || "desktop",
        deviceVendor: result.platform.vendor || "",
        deviceModel: result.platform.model || "",
      };
    };
  }, []);

  const userAgentInfo = useMemo(
    () => parseUserAgent(contactSession?.metadata?.userAgent),
    [contactSession?.metadata?.userAgent, parseUserAgent],
  );

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metadata?.timezone);
  }, [contactSession?.metadata?.timezone]);

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) {
      return [];
    }

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "デバイス情報",
        items: [
          {
            label: "ブラウザ",
            value:
              userAgentInfo.browser +
              (userAgentInfo.browserVersion
                ? ` ${userAgentInfo.browserVersion}`
                : ""),
          },
          {
            label: "OS",
            value:
              userAgentInfo.os +
              (userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ""),
          },
          {
            label: "デバイス",
            value:
              userAgentInfo.device +
              (userAgentInfo.deviceModel
                ? ` - ${userAgentInfo.deviceModel}`
                : ""),
            className: "capitalize",
          },
          {
            label: "画面サイズ",
            value: contactSession.metadata.screenResolution,
          },
          {
            label: "表示領域",
            value: contactSession.metadata.viewportSize,
          },
          {
            label: "Cookie",
            value: contactSession.metadata.cookieEnabled ? "有効" : "無効",
          },
        ],
      },
      {
        id: "location-info",
        icon: GlobeIcon,
        title: "地域と言語",
        items: [
          ...(countryInfo
            ? [
                {
                  label: "国",
                  value: <span>{countryInfo.name}</span>,
                },
              ]
            : []),
          {
            label: "言語",
            value: contactSession.metadata.language,
          },
          {
            label: "タイムゾーン",
            value: contactSession.metadata.timezone,
          },
          {
            label: "UTCオフセット",
            value: contactSession.metadata.timezoneOffset,
          },
        ],
      },
      {
        id: "section-details",
        title: "セッション詳細",
        icon: ClockIcon,
        items: [
          {
            label: "セッション開始日時",
            value: new Date(contactSession._creationTime).toLocaleString(),
          },
        ],
      },
    ];
  }, [contactSession, userAgentInfo, countryInfo]);

  if (contactSession === undefined || contactSession === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <DicebearAvatar
            badgeImageUrl={
              countryInfo?.code
                ? getCountryFlagUrl(countryInfo.code)
                : undefined
            }
            seed={contactSession._id}
            size={42}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-x-2">
              <h4 className="line-clamp-1">{contactSession.name}</h4>
            </div>
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {contactSession.email}
            </p>
          </div>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href={`mailto:${contactSession.email}`}>
            <MailIcon />
            <span>メールを送る</span>
          </Link>
        </Button>
      </div>

      <div>
        {contactSession.metadata && (
          <Accordion
            className="w-full rounded-none border-y"
            collapsible
            type="single"
          >
            {accordionSections.map((section) => (
              <AccordionItem
                className="rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                key={section.id}
                value={section.id}
              >
                <AccordionTrigger className="flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50">
                  <div className="flex items-center gap-4">
                    <section.icon className="size-4 shrink-0" />
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 py-4">
                  <div className="space-y-2 text-sm">
                    {section.items.map((item) => (
                      <div
                        className="flex justify-between"
                        key={`${section.id}-${item.label}`}
                      >
                        <span className="text-muted-foreground">
                          {item.label}:
                        </span>
                        <span className={item.className}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
