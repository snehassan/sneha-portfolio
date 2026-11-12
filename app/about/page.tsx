import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CoffeeWord } from "@/components/CoffeeWord";

export const metadata: Metadata = { title: "About | Sneha Hassan" };

export default function About() {
  return (
    <PageShell eyebrow="the human behind the resume" title="About">
      <p className="body-copy">
        Fueled by curiosity and way too much <CoffeeWord />, I turn chaotic ideas
        into beautifully organized realities. I started in software at Ather
        Energy, building things riders actually touched, from ML pipelines
        watching the road to a treasure hunt spread across an entire city.
      </p>
      <p className="body-copy">
        Now at Carnegie Mellon, I spend my days asking language models hard
        biology questions and my evenings incubating a VR rehab startup. I care
        about products that teach, heal, or at minimum, don&apos;t annoy people.
      </p>
      <p className="body-copy" style={{ marginBottom: 40 }}>
        Off the clock: robots the size of a matchbox, writing on Medium, and
        being the designated funny person in serious meetings.
      </p>

      <div className="card card--pink" style={{ padding: "22px 26px" }}>
        <div className="proj-meta">
          <span>Currently</span>
        </div>
        <ul style={{ fontSize: 17, lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
          <li>Researching LLM reasoning at CMU xulab</li>
          <li>Incubating RecoVR</li>
          <li>
            Open to interesting problems,{" "}
            <a href="mailto:snehahassan7920@gmail.com">say hi</a>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
